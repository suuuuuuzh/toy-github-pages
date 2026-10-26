# toy-github-pages

Haina Zhou's GitHub Pages site (served from `main`). Claude commits straight to `main` with
`Publish: <what>` messages. Don't touch other directories when working on the calendar.

## WTRSO pre-production calendar (`wtrso-calendar/`)

Subscribable ICS feed for "When the River Split Open / 当河流轻声撕裂". Subscribers (Google / Apple)
pull `wtrso-calendar/wtrso-preproduction.ics` on their own schedule, so **every push to `main`
is a published update** for everyone subscribed.

- Feed: https://suuuuuuzh.github.io/toy-github-pages/wtrso-calendar/wtrso-preproduction.ics
- Landing page with subscribe buttons: https://suuuuuuzh.github.io/toy-github-pages/wtrso-calendar/
- Contact shown on the calendar: contact@hainazhou.com

### Standing instruction

Whenever the user sends a schedule PDF (Daily Pre-production Schedule / Advance Schedule,
每日筹备计划 / 预备通告), update the calendar without being asked again. If the file clearly isn't a
WTRSO schedule, ask first.

1. Read the PDF: `pdftotext -layout` plus `pdftoppm -r 60 -png` to eyeball every page for anything
   text extraction missed.
2. Edit `wtrso-calendar/schedule.json`:
   - The newest PDF is authoritative for every date it covers: replace all events on those dates,
     keep events on dates it does not cover.
   - Event `id` is `YYYYMMDD-slug` and becomes the UID. Keep the id of an event that carries over
     from an earlier PDF so subscribers see an update, not a duplicate. New events get new ids;
     events no longer in the PDF are removed.
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
3. Run `python3 wtrso-calendar/build_ics.py`, then sanity-check the output (parses, every line
   <= 75 octets, CRLF endings, unique UIDs, expected event count).
4. Commit `wtrso-calendar/` as `Publish: WTRSO schedule <dates>` and push to `main`.
5. Tell the user what was added / changed / removed, and any assumption made. Mention that GitHub
   Pages takes a minute or two to deploy and that Google refreshes subscribed calendars every
   ~12-24 h (Apple's refresh interval is configurable).

Do not write these events into the user's personal Google calendars through the Calendar
connector: it cannot create calendars, and the feed is the single source of truth.
