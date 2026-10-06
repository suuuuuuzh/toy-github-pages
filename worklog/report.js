// 廿一项目进展：页面「双周汇报」和每天早上的例行整理共用这一份逻辑。
// 用法：buildReport({ logs, todos, reportCats, from, to, skip, withDates }) → 文本
const REPORT_GROUPS = [
  ["内藏班", ["内藏班"]],
  ["色珍", ["色珍新长片", "色珍"]],
  ["黑豆", ["黑豆", "TIFF"]],
  ["竹林遗录", ["竹林遗录"]],
  ["廿一（公司事务）", ["廿一"]],
];

function buildReport({ logs, todos, reportCats, from, to, skip, withDates }) {
  skip = skip || new Set();
  const md = (s) => (s ? Number(s.slice(5, 7)) + "/" + Number(s.slice(8, 10)) : "");
  const dot = (s) => s.replace(/-/g, ".");
  const plus14 = (() => { const d = new Date(to + "T00:00:00"); d.setDate(d.getDate() + 14); return d.toISOString().slice(0, 10); })();
  const cn = ["一", "二", "三", "四", "五", "六", "七"];
  const inGroup = (projs, x) => projs.includes(x.project) && reportCats.includes(x.cat) && !skip.has(x.project);
  const lines = [`廿一项目进展（${dot(from)} – ${dot(to)}）`, "", "【本期工作】"];
  let n = 0;
  REPORT_GROUPS.forEach(([name, projs]) => {
    const items = logs.filter((l) => l.date >= from && l.date <= to && inGroup(projs, l))
      .sort((a, b) => a.date.localeCompare(b.date));
    if (!items.length) return;
    lines.push("", `${cn[n++]}、${name}`);
    items.forEach((l) => lines.push(`   · ${l.cat === "sound" ? "【声音】" : ""}${l.text}${l.status === "ongoing" ? "（进行中）" : ""}${withDates ? `  ${md(l.date)}` : ""}`));
  });
  if (!n) lines.push("  本期无");
  lines.push("", "【下两周计划】");
  let m = 0;
  REPORT_GROUPS.forEach(([name, projs]) => {
    const next = todos.filter((x) => x.status !== "done" && inGroup(projs, x) && (!x.due || (x.due >= from && x.due <= plus14)))
      .sort((a, b) => (a.due || "9").localeCompare(b.due || "9"));
    if (!next.length) return;
    m++;
    lines.push(`  ${name}`);
    next.forEach((x) => lines.push(`   · ${x.text}${x.due ? `（${md(x.due)} 前）` : ""}`));
  });
  if (!m) lines.push("  暂无");
  return lines.join("\n");
}

if (typeof module !== "undefined") module.exports = { buildReport, REPORT_GROUPS };
