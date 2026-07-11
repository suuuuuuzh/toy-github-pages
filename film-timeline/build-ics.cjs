/*
  从 data.js 生成 calendar.ics(供手机日历“订阅”,自动更新)。
  本地手动跑:  node film-timeline/build-ics.cjs
  一般不用手动跑 —— GitHub Action 会在你改完 data.js 后自动重建。
*/
const fs = require("fs");
const path = require("path");
const D = require("./data.js");

const STATUS_LABEL = { done: "已完成", active: "进行中", upcoming: "待开始" };
const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const p2 = (n) => String(n).padStart(2, "0");
const dateOnly = (d) => `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}`;

function toStart(dateStr, time) {
  const d = parse(dateStr);
  if (time) { const [h, mi] = time.split(":").map(Number); return `${dateOnly(d)}T${p2(h)}${p2(mi)}00`; }
  return dateOnly(d);
}

const lines = [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//film-timeline//CN",
  "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
  `X-WR-CALNAME:${D.project.title}`,
  "REFRESH-INTERVAL;VALUE=DURATION:PT12H", "X-PUBLISHED-TTL:PT12H",
];
let uid = 0;
function pushEvent(startStr, endStr, title) {
  lines.push("BEGIN:VEVENT", `UID:film-${uid++}@timeline`);
  if (startStr.includes("T")) {
    lines.push(`DTSTART:${startStr}`);
    if (endStr) lines.push(`DTEND:${endStr}`);
  } else {
    lines.push(`DTSTART;VALUE=DATE:${startStr}`);
    if (endStr) lines.push(`DTEND;VALUE=DATE:${endStr}`);
  }
  lines.push(`SUMMARY:${title}`, "END:VEVENT");
}

D.stages.forEach((s) => {
  const e = parse(s.end); e.setDate(e.getDate() + 1); // 全天事件 DTEND 为结束次日
  pushEvent(toStart(s.start), dateOnly(e), `【${STATUS_LABEL[s.status] || ""}】${s.name}`);
});
D.events.forEach((ev) => pushEvent(toStart(ev.date, ev.time), "", ev.title));

lines.push("END:VCALENDAR");
fs.writeFileSync(path.join(__dirname, "calendar.ics"), lines.join("\r\n") + "\r\n");
console.log(`calendar.ics 已生成:${D.stages.length} 个阶段 + ${D.events.length} 个事件`);
