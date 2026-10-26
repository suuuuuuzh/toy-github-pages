#!/usr/bin/env python3
"""Mirror schedule.json into an existing iCloud calendar over CalDAV (stdlib only).

Env: ICLOUD_APPLE_ID, ICLOUD_APP_PASSWORD (an app-specific password) and
ICLOUD_CALENDAR_NAME (the calendar's name in the Calendar app). Optional:
DRY_RUN=1 (report only), CALDAV_BASE (default https://caldav.icloud.com).

One event per schedule.json entry is created or updated in place (matched by UID).
Events this script created earlier (UID like 20261029-ad-joins@hainazhou.com) that are
no longer in the schedule are deleted. Everything else in the calendar is never touched.
The log of a public repo's Actions run is public, so nothing about the account is printed.
"""
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

import build_ics

DAV, CAL = "{DAV:}", "{urn:ietf:params:xml:ns:caldav}"
XML_HEAD = '<?xml version="1.0" encoding="utf-8"?>'
XML_HEADERS = {"Content-Type": "application/xml; charset=utf-8"}
OURS = re.compile(r"^\d{8}-[a-z0-9-]+@" + re.escape(build_ics.UID_DOMAIN) + "$")


class CalDAV:
    def __init__(self, base, user, password):
        self.base = base
        self.hosts = {urllib.parse.urlsplit(base).hostname}
        token = base64.b64encode(f"{user}:{password}".encode()).decode()
        self.auth = f"Basic {token}"

    def request(self, method, url, body=None, headers=None):
        url = urllib.parse.urljoin(self.base, url)
        host = urllib.parse.urlsplit(url).hostname or ""
        if host not in self.hosts and not host.endswith(".icloud.com"):
            sys.exit("refusing to send credentials to an unexpected host")
        req = urllib.request.Request(url, data=body, method=method,
                                     headers={"Authorization": self.auth, **(headers or {})})
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.status, resp.read()
        except urllib.error.HTTPError as err:
            return err.code, err.read()

    def propfind(self, url, depth, props):
        body = (f'{XML_HEAD}<d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">'
                f"<d:prop>{props}</d:prop></d:propfind>").encode()
        status, data = self.request("PROPFIND", url, body, {"Depth": depth, **XML_HEADERS})
        if status == 401:
            sys.exit("iCloud rejected the Apple ID / app-specific password (HTTP 401)")
        if status != 207:
            sys.exit(f"PROPFIND failed (HTTP {status})")
        return ET.fromstring(data)


def find_calendar(dav, name):
    root = dav.propfind("/", "0", "<d:current-user-principal/>")
    principal = root.findtext(f".//{DAV}current-user-principal/{DAV}href")
    root = dav.propfind(principal, "0", "<c:calendar-home-set/>")
    home = root.findtext(f".//{CAL}calendar-home-set/{DAV}href")
    dav.base = urllib.parse.urljoin(dav.base, home)  # iCloud serves each account from its own host
    root = dav.propfind(home, "1", "<d:displayname/><d:resourcetype/>"
                                   "<c:supported-calendar-component-set/>")
    found = []
    for resp in root.findall(f"{DAV}response"):
        is_cal = resp.find(f".//{DAV}resourcetype/{CAL}calendar") is not None
        comps = {c.get("name") for c in resp.iterfind(f".//{CAL}comp")}
        if is_cal and "VEVENT" in comps:  # skips Reminders lists, which are VTODO-only
            found.append((resp.findtext(f"{DAV}href"),
                          (resp.findtext(f".//{DAV}displayname") or "").strip()))
    want = name.strip().lower()
    pick = [c for c in found if c[1].lower() == want] \
        or [c for c in found if want in c[1].lower()]
    if len(pick) != 1:
        sys.exit(f"no single calendar matches ICLOUD_CALENDAR_NAME (looked at {len(found)} calendars)")
    return pick[0][0]


def existing_events(dav, cal_href):
    """UID -> resource href for every event already in the calendar."""
    body = (f'{XML_HEAD}<c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">'
            "<d:prop><d:getetag/><c:calendar-data/></d:prop>"
            '<c:filter><c:comp-filter name="VCALENDAR"><c:comp-filter name="VEVENT"/>'
            "</c:comp-filter></c:filter></c:calendar-query>").encode()
    status, data = dav.request("REPORT", cal_href, body, {"Depth": "1", **XML_HEADERS})
    if status != 207:
        sys.exit(f"listing the calendar failed (HTTP {status})")
    out = {}
    for resp in ET.fromstring(data).findall(f"{DAV}response"):
        ics = (resp.findtext(f".//{CAL}calendar-data") or "").replace("\r\n ", "").replace("\n ", "")
        uid = re.search(r"^UID:(.+?)\s*$", ics, re.M)
        if uid:
            out[uid.group(1)] = resp.findtext(f"{DAV}href")
    return out


def main():
    user, password, name = (os.environ.get(k, "").strip() for k in
                            ("ICLOUD_APPLE_ID", "ICLOUD_APP_PASSWORD", "ICLOUD_CALENDAR_NAME"))
    if not (user and password and name):
        print("::notice::iCloud sync skipped: the ICLOUD_APPLE_ID, ICLOUD_APP_PASSWORD and "
              "ICLOUD_CALENDAR_NAME secrets are not all set")
        return
    dry = bool(os.environ.get("DRY_RUN"))
    data = json.loads((Path(build_ics.__file__).parent / "schedule.json").read_text(encoding="utf-8"))
    if not data["events"]:
        sys.exit("schedule.json has no events; refusing to sync (it would delete everything)")

    dav = CalDAV(os.environ.get("CALDAV_BASE", "https://caldav.icloud.com"), user, password)
    cal_href = find_calendar(dav, name)
    have = existing_events(dav, cal_href)
    print(f"calendar found, {len(have)} events in it{' (dry run)' if dry else ''}")

    failed, wanted = 0, set()
    for ev in data["events"]:
        uid = f"{ev['id']}@{build_ics.UID_DOMAIN}"
        wanted.add(uid)
        href = have.get(uid) or cal_href.rstrip("/") + "/" + urllib.parse.quote(uid + ".ics", safe="")
        verb = "update" if uid in have else "create"
        if dry:
            print(f"would {verb} {uid}")
            continue
        body = build_ics.build({**data, "events": [ev]}, caldav=True).encode("utf-8")
        status, _ = dav.request("PUT", href, body, {"Content-Type": "text/calendar; charset=utf-8"})
        ok = status in (200, 201, 204)
        failed += not ok
        print(f"{verb}d {uid}" if ok else f"FAILED to {verb} {uid} (HTTP {status})")

    for uid, href in sorted(have.items()):
        if uid in wanted or not OURS.match(uid):
            continue
        if dry:
            print(f"would delete {uid}")
            continue
        status, _ = dav.request("DELETE", href)
        ok = status in (200, 204)
        failed += not ok
        print(f"deleted {uid}" if ok else f"FAILED to delete {uid} (HTTP {status})")
    if failed:
        sys.exit(f"{failed} change(s) failed")


if __name__ == "__main__":
    main()
