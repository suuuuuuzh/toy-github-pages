#!/usr/bin/env python3
"""Build the .ics feeds from schedule.json (stdlib only).

Usage: python3 build_ics.py
Edit schedule.json (one entry per event; no "start" means all-day; "type" is
"schedule" or "todo"), re-run, then commit the JSON and the .ics files. Each
entry in "feeds" becomes one file: type null = everything, else only that type.
Subscribed clients pick the change up on their next refresh.
"""
import json
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "schedule.json"
UID_DOMAIN = "hainazhou.com"
ALARM_MINUTES = 30
TODO_PREFIX = "☑️ "


def esc(text):
    return (text.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,")
            .replace("\r\n", "\n").replace("\n", "\\n"))


def fold(line):
    """RFC 5545 line folding: max 75 octets per line, never split a UTF-8 char."""
    raw = line.encode("utf-8")
    if len(raw) <= 75:
        return line
    parts, limit = [], 75
    while raw:
        cut = min(limit, len(raw))
        while cut < len(raw) and (raw[cut] & 0xC0) == 0x80:
            cut -= 1
        parts.append(raw[:cut].decode("utf-8"))
        raw = raw[cut:]
        limit = 74  # continuation lines start with one space
    return "\r\n ".join(parts)


def local(d, hhmm):
    return f"{d.strftime('%Y%m%d')}T{hhmm.replace(':', '')}00"


def build(data, feed):
    cal, tz = data["calendar"], data["calendar"]["timezone"]
    events = [e for e in data["events"] if feed["type"] in (None, e["type"])]
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    footer = ["", "Contact 联系: " + cal["contact"].split("<")[-1].rstrip(">")]
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//hainazhou.com//When the River Split Open pre-production//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:{esc(feed['name'])}",
        f"X-WR-CALDESC:{esc(chr(10).join(feed['description']))}",
        f"X-WR-TIMEZONE:{tz}",
        "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
        "X-PUBLISHED-TTL:PT1H",
        "BEGIN:VTIMEZONE",
        f"TZID:{tz}",
        "BEGIN:STANDARD",
        "DTSTART:19700101T000000",
        "TZOFFSETFROM:+0800",
        "TZOFFSETTO:+0800",
        "TZNAME:CST",
        "END:STANDARD",
        "END:VTIMEZONE",
    ]
    for ev in events:
        d = date.fromisoformat(ev["date"])
        lines += ["BEGIN:VEVENT", f"UID:{ev['id']}@{UID_DOMAIN}", f"DTSTAMP:{stamp}",
                  f"LAST-MODIFIED:{stamp}"]
        if "start" in ev:
            lines += [f"DTSTART;TZID={tz}:{local(d, ev['start'])}",
                      f"DTEND;TZID={tz}:{local(d, ev['end'])}", "TRANSP:OPAQUE"]
        else:
            lines += [f"DTSTART;VALUE=DATE:{d.strftime('%Y%m%d')}",
                      f"DTEND;VALUE=DATE:{(d + timedelta(days=1)).strftime('%Y%m%d')}",
                      "TRANSP:TRANSPARENT"]
        title = TODO_PREFIX + ev["title"] if ev["type"] == "todo" else ev["title"]
        lines.append(f"SUMMARY:{esc(title)}")
        if ev.get("location"):
            lines.append(f"LOCATION:{esc(ev['location'])}")
        lines += [f"DESCRIPTION:{esc(chr(10).join(ev['description'] + footer))}",
                  f"CONTACT:{esc(cal['contact'])}", "STATUS:CONFIRMED"]
        if "start" in ev:
            lines += ["BEGIN:VALARM", "ACTION:DISPLAY", f"DESCRIPTION:{esc(title)}",
                      f"TRIGGER:-PT{ALARM_MINUTES}M", "END:VALARM"]
        lines.append("END:VEVENT")
    lines.append("END:VCALENDAR")
    return "".join(fold(l) + "\r\n" for l in lines)


if __name__ == "__main__":
    data = json.loads(SRC.read_text(encoding="utf-8"))
    for feed in data["feeds"]:
        (HERE / feed["file"]).write_bytes(build(data, feed).encode("utf-8"))
        n = sum(feed["type"] in (None, e["type"]) for e in data["events"])
        print(f"wrote {feed['file']}: {n} events")
