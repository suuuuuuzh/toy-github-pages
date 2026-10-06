// 命令行生成廿一项目进展：node worklog/tools-report.js [from] [to]（默认最近 14 天）
const fs = require("fs"), path = require("path");
const dir = __dirname;
const data = new Function(fs.readFileSync(path.join(dir, "data.js"), "utf8") + "; return { logs, todos, reportCats, reportProjects };")();
const { buildReport } = require(path.join(dir, "report.js"));
const iso = (d) => d.toISOString().slice(0, 10);
const to = process.argv[3] || iso(new Date());
const from = process.argv[2] || iso(new Date(new Date(to).getTime() - 13 * 864e5));
const skip = new Set(data.logs.concat(data.todos).map((x) => x.project).filter((p) => !data.reportProjects.includes(p)));
console.log(buildReport({ ...data, from, to, skip, withDates: true }));
