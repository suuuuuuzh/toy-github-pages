// 工作日志 —— 每天的工作记录 + 待办。页面会按两周自动生成工作汇报。
// 记法见 worklog/README.md。只追加，不要删改历史记录。

const categories = [
  { key: "sound", name: "声音后期" },
  { key: "prod", name: "制片" },
  { key: "study", name: "留学" },
];

// 每日记录：一件事一行。status: "done" 已完成 / "ongoing" 进行中
const logs = [
  // ---- 2026-09-28 ----
  { date: "2026-09-28", cat: "prod", project: "WTRSO", status: "ongoing",
    text: "制作 WTRSO schedule 及使用说明（使用说明未完成；schedule 还需确认部分演员细节）" },
  { date: "2026-09-28", cat: "study", project: "Allan creative video", status: "done",
    text: "完成 shotlist + script" },
  { date: "2026-09-28", cat: "study", project: "Allan creative video", status: "done",
    text: "Allan 拍摄" },
  { date: "2026-09-28", cat: "study", project: "Allan creative video", status: "done",
    text: "和 Allan 妈妈沟通拍摄情况" },
  { date: "2026-09-28", cat: "study", project: "Allan creative video", status: "done",
    text: "给 Yige 买拍摄回程的票" },
  { date: "2026-09-28", cat: "prod", project: "廿一", status: "done",
    text: "廿一 8 月、9 月工作总结" },
  { date: "2026-09-28", cat: "study", project: "Kate creative video", status: "done",
    text: "约 Kate creative video 会议时间" },
  { date: "2026-09-28", cat: "prod", project: "色珍", status: "done",
    text: "和色珍沟通约开会时间；更新后续工作待办事项" },
  { date: "2026-09-28", cat: "study", project: "Kimi", status: "done",
    text: "Kimi 图片解说写作" },
  { date: "2026-09-28", cat: "study", project: "留学 video 剪辑", status: "done",
    text: "和龚老师（留学 video 剪辑师）约会议时间，提前沟通会议内容" },
];

// 待办：owner "我" 会进汇报的「下两周计划」；"秘书" 是交给秘书的事。
// status: "open" 待做 / "waiting" 等条件 / "done" 完成（完成时填 doneDate）
const todos = [
  { id: 1, cat: "prod", project: "WTRSO", owner: "我", status: "open", created: "2026-09-28", due: "2026-10-12",
    text: "完成 WTRSO 使用说明" },
  { id: 2, cat: "prod", project: "WTRSO", owner: "我", status: "open", created: "2026-09-28", due: "2026-10-12",
    text: "schedule：确认演员细节" },
  { id: 3, cat: "prod", project: "WTRSO", owner: "我", status: "open", created: "2026-09-28", due: "2026-10-12",
    text: "schedule：标记 tag" },
  { id: 4, cat: "prod", project: "WTRSO", owner: "我", status: "open", created: "2026-09-28", due: "2026-10-12",
    text: "schedule：转到 MMS" },
  { id: 5, cat: "study", project: "Allan creative video", owner: "秘书", status: "waiting", created: "2026-09-28", due: "",
    text: "给 Allan 妈妈整理账单、报销费用", note: "等 Avis 结账以后再算" },
];
