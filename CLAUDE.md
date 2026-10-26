# toy-github-pages

Haina Zhou's GitHub Pages site (served from `main`). Claude commits straight to `main` with
`Publish: <what>` messages. Don't touch other directories when working on the calendar.

## WTRSO pre-production calendar (`wtrso-calendar/`)

Subscribable ICS feeds for "When the River Split Open / 当河流轻声撕裂". Subscribers (Google / Apple)
pull the feeds on their own schedule, so **every push to `main` is a published update** for
everyone subscribed. `schedule.json` is the single source; `build_ics.py` writes all feeds:

| Feed file | Contains |
| --- | --- |
| `wtrso-preproduction.ics` | everything (the original link, keep it working) |
| `wtrso-schedule.ics` | `type: "schedule"` events only |
| `wtrso-todo.ics` | `type: "todo"` events only (titles auto-prefixed ☑️) |

- Base URL: https://suuuuuuzh.github.io/toy-github-pages/wtrso-calendar/ (landing page with subscribe
  buttons at that URL; feeds are `<base>/<file>`)
- Contact shown on the calendar: contact@hainazhou.com

### Standing instruction

Whenever the user sends new schedule information, update the calendar without being asked again.
That means a schedule PDF (Daily Pre-production Schedule / Advance Schedule, 每日筹备计划 / 预备通告)
or plain text in chat such as "location scout is confirmed for 10:00" or "add X to Friday". If a
file clearly isn't a WTRSO schedule, ask first.

1. For a PDF: `pdftotext -layout` plus `pdftoppm -r 60 -png`, and look at every page for anything
   text extraction missed.
2. Edit `wtrso-calendar/schedule.json`:
   - The newest information is authoritative. A new PDF replaces all events on the dates it
     covers and keeps events on dates it does not cover. A chat message changes only what it
     mentions.
   - **Refine vague items in place.** When details arrive for an existing event (a TBC gets a real
     time, people or a location get added, wording changes), edit that event and keep its `id`, so
     subscribers see an update, not a duplicate. A TBC all-day event becomes timed by adding
     `start`/`end`. Only add a new event for something genuinely new, and remove events that are
     no longer in the latest schedule. Event `id` is `YYYYMMDD-slug` and becomes the UID.
   - `type`: `schedule` = something happening at a set time or place, or people being somewhere
     (travel/arrivals, meetings, location scouts, call times), even while the time is still TBC.
     `todo` = a task or errand someone just has to get done, with no fixed time (daily task lists,
     arranging the hotel, buying supplies). When in doubt, pick one and say so in the reply. If a
     to-do gets a fixed time, switch it to `schedule`.
   - Title is `English / 中文`. Description is the PDF text verbatim in both languages, led by the
     PDF's date header (EN line, then 中文 line). Keep the PDF's wording (e.g. 堪景).
   - Timed items: `start`/`end` in 24h, Asia/Shanghai. "TBC" and "All Day" items: omit `start`
     (all-day). If no end time is given, use 1 hour and add the "(End time not given...)" note line
     like the existing events.
   - Travel items: start the title with ✈️ and write `✈️ TRAVEL 差旅` in the description.
   - `location` only when the PDF names a place.
   - Names, spelled the same way every time: Jess (Director 导演), Zhao Xinyi 赵馨怡 (Producer
     制片人), Jiang Ruohong 江如鸿 (Line Producer 执行制片人), Ma Rong 马蓉 (Living Manager
     生活制片), Wang Zhonghua 王忠华 (Location Manager 外联制片), Shui Su 水素 (AD).
3. Run `python3 wtrso-calendar/build_ics.py`, then sanity-check every feed (parses, every line
   <= 75 octets, CRLF endings, unique UIDs, expected event counts: all = schedule + todo).
4. Commit `wtrso-calendar/` as `Publish: WTRSO schedule <dates>` and push to `main`.
5. Tell the user what was added / changed / removed (and which feed each is in), and any
   assumption made. Mention that GitHub Pages takes a minute or two to deploy and that Google
   refreshes subscribed calendars every ~12-24 h (Apple's refresh interval is configurable).

Do not write these events into the user's personal Google calendars through the Calendar
connector: it cannot create calendars, and the feeds are the single source of truth.
