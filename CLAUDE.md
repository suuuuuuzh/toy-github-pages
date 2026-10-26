# toy-github-pages

Haina Zhou's GitHub Pages site (served from `main`). Claude commits straight to `main` with
`Publish: <what>` messages. Don't touch other directories when working on the calendar.

## WTRSO AD calendar (`wtrso-calendar/`)

One subscribable ICS calendar for "When the River Split Open / 当河流轻声撕裂", covering only what
is relevant to the **AD (assistant director) team**. Subscribers (Google / Apple) pull the feed on
their own schedule, so **every push to `main` is a published update** for everyone subscribed.

- `schedule.json` is the single source; `build_ics.py` writes `wtrso-preproduction.ics` from it.
  Keep that file name: it is the link people already subscribed to.
- Base URL: https://suuuuuuzh.github.io/toy-github-pages/wtrso-calendar/ (landing page with
  subscribe buttons at that URL; feed is `<base>/wtrso-preproduction.ics`)
- Contact shown on the calendar: contact@hainazhou.com
- There is deliberately one calendar, not several. Don't split it into separate feeds.
- **iCloud mirror.** The user also keeps the same events in their existing iCloud calendar
  ("wtrso calendar", which they publish to the crew). The GitHub Action
  `.github/workflows/wtrso-icloud-sync.yml` runs `wtrso-calendar/sync_icloud.py` on every push that
  touches `schedule.json` or the scripts and mirrors the events there over CalDAV. It needs the
  repo secrets `ICLOUD_APPLE_ID`, `ICLOUD_APP_PASSWORD` (app-specific password) and
  `ICLOUD_CALENDAR_NAME`; without them it logs a notice and does nothing. It matches events by UID,
  updates them in place, and only deletes events whose UID looks like
  `YYYYMMDD-slug@hainazhou.com`, so keep the id format. Never ask the user to paste Apple
  credentials in chat (they go in GitHub secrets), and never print account details in its log:
  the Actions log of this public repo is public.

### Standing instruction

Whenever the user sends new schedule information, update the calendar without being asked again.
That means the daily pre-production notice PDF (Daily Pre-production Schedule / Advance Schedule,
每日筹备计划 / 预备通告) or plain text in chat such as "location scout is confirmed for 10:00" or
"add X to Friday". If a file clearly isn't a WTRSO schedule, ask first.

1. For a PDF: `pdftotext -layout` plus `pdftoppm -r 60 -png`, and look at every page for anything
   text extraction missed.
2. **Pull out only the AD-related items** and edit `wtrso-calendar/schedule.json`.
   - Include: the AD team's own tasks; anything that names the AD (currently Shui Su 水素) or "AD";
     every department meeting that has a time (ADs attend most of them: costume/makeup, art,
     camera, etc.); scouts, rehearsals, readings, shoots, calls and travel the AD takes part in.
   - Skip: other people's logistics and internal tasks with no AD involvement (e.g. production
     office hotel, catering, supplies, other people's travel). Not-AD-related is the default for
     those; the user said they don't want them.
   - Unsure whether it involves the AD: include it and flag it in the reply so the user can say
     remove it. A missing AD meeting costs more than one extra entry.
   - Every reply lists what was skipped (one line each) so the user can ask for any to be added.
3. How to write each event:
   - The newest information is authoritative. A new PDF replaces all events on the dates it
     covers and keeps events on dates it does not cover. A chat message changes only what it
     mentions.
   - **Refine vague items in place.** When details arrive for an existing event (a TBC gets a real
     time, people or a location get added, wording changes), edit that event and keep its `id`, so
     subscribers see an update, not a duplicate. A TBC all-day event becomes timed by adding
     `start`/`end`. Only add a new event for something genuinely new, and remove events that are
     no longer in the latest schedule. Event `id` is `YYYYMMDD-slug` and becomes the UID.
   - `type`: `schedule` = something happening at a set time or place, or people being somewhere
     (meetings, scouts, call times, arrivals), even while the time is still TBC. `todo` = a task
     someone just has to get done, with no fixed time (the AD team's daily task list). `todo`
     titles get a ✅ automatically. When in doubt, pick one and say so in the reply. If a to-do gets
     a fixed time, switch it to `schedule`.
   - Markers: ✅ to-do (automatic from `type`), 💻 online meeting (set `"online": true`; automatic
     prefix), ✈️ travel (write it at the start of the title and use `✈️ TRAVEL 差旅` in the
     description). Mark a meeting online only when the notice or the user says so (线上, online,
     视频, Zoom, 腾讯会议, 飞书 ...), never assume. Put any meeting link they give in the description.
   - Title is `English / 中文`. Description is the PDF text verbatim in both languages, led by the
     PDF's date header (EN line, then 中文 line). Keep the PDF's wording (e.g. 堪景).
   - Timed items: `start`/`end` in 24h, Asia/Shanghai. "TBC" and "All Day" items: omit `start`
     (all-day). If no end time is given, use 1 hour and add the "(End time not given...)" note line
     like the existing events.
   - `location` only when the PDF names a place.
   - Names, spelled the same way every time: Jess (Director 导演), Zhao Xinyi 赵馨怡 (Producer
     制片人), Jiang Ruohong 江如鸿 (Line Producer 执行制片人), Ma Rong 马蓉 (Living Manager
     生活制片), Wang Zhonghua 王忠华 (Location Manager 外联制片), Shui Su 水素 (AD).
4. Run `python3 wtrso-calendar/build_ics.py`, then sanity-check the feed (parses, every line
   <= 75 octets, CRLF endings, unique UIDs, expected event count).
5. Commit `wtrso-calendar/` as `Publish: WTRSO schedule <dates>` and push to `main`.
6. Check that the "Sync WTRSO calendar to iCloud" run for that push succeeded (`actions_list`
   `list_workflow_runs` for `wtrso-icloud-sync.yml`; `get_job_logs` if it failed) and say so. A
   "skipped: secrets not set" notice means the user has not finished the iCloud setup.
7. Tell the user what was added / changed / removed / skipped, and any assumption made. Mention
   that GitHub Pages takes a minute or two to deploy, that Google refreshes subscribed calendars
   every ~12-24 h (Apple's refresh interval is configurable), and that the iCloud calendar is
   updated by the Action.

Do not write these events into the user's personal Google calendars through the Calendar
connector: it cannot create calendars. The feed is the source of truth, and the only push into a
personal calendar is the iCloud Action above.
