// 工作日志 —— 每天的工作记录 + 待办。页面会按两周自动生成工作汇报。
// 记法见 worklog/README.md。只追加，不要删改历史记录。

const categories = [
  { key: "sound", name: "声音后期" },
  { key: "prod", name: "制片" },
  { key: "study", name: "留学" },
  { key: "other", name: "其他" }, // 搬家、还车等杂务，不进汇报
];

// 双周汇报只汇报这些分类（其他分类照常记录、在页面上查看，但不进汇报）
const reportCats = ["prod"];

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
  { date: "2026-09-28", cat: "sound", project: "Cargo 个人网站", status: "done",
    text: "更新 Cargo 个人网站" },
  { date: "2026-09-28", cat: "prod", project: "内藏班", status: "done",
    text: "编写内藏班项目情况、策略及后续计划文件，发送给威姐" },
  { date: "2026-09-28", cat: "prod", project: "内藏班", status: "done",
    text: "内藏班预算更新" },
  { date: "2026-09-28", cat: "sound", project: "Yamira", status: "done",
    text: "查看 Yamira 的 note，并简单沟通" },

  // ---- 2026-09-30 ----
  { date: "2026-09-30", cat: "study", project: "Allan creative video", status: "done",
    text: "送 Allan 拍摄（island）的同事去车站" },
  { date: "2026-09-30", cat: "other", project: "搬家", status: "done",
    text: "从纽约开车到波士顿搬家；整理物品、清理丢弃、装箱" },
  { date: "2026-09-30", cat: "other", project: "搬家", status: "done",
    text: "还 Avis 租车，已结账" },
  { date: "2026-09-30", cat: "sound", project: "Yamira", status: "done",
    text: "就 Yamira 的 notes 进行沟通" },
  { date: "2026-09-30", cat: "sound", project: "Yamira", status: "done",
    text: "请合作声音设计师 Amelia 发送新的 Yamira pass" },
  { date: "2026-09-30", cat: "study", project: "留学 video 剪辑", status: "done",
    text: "与剪辑师沟通项目情况：后续几位学生的创意思路、拍摄进度及最终交付时间周期" },
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
  { id: 5, cat: "study", project: "Allan creative video", owner: "秘书", status: "open", created: "2026-09-28", due: "",
    text: "给 Allan 妈妈整理账单、报销费用", note: "Avis 已于 9/30 结账，可以开始算" },
  { id: 6, cat: "sound", project: "Yamira", owner: "我", status: "open", created: "2026-09-28", due: "2026-09-29",
    text: "根据 Yamira 的 note 做准备", note: "9/29 早上 8:00–9:00" },
  { id: 7, cat: "sound", project: "Yamira", owner: "我", status: "waiting", created: "2026-09-30", due: "",
    text: "收到新的 Yamira pass 后继续", note: "等 Amelia（合作声音设计师）发来" },
  { id: 8, cat: "study", project: "报销", owner: "我", status: "open", created: "2026-09-30", plan: "2026-10-01", due: "",
    text: "让 AI 读 Amex 账单，整理这几天的报销" },
  { id: 9, cat: "study", project: "报销", owner: "我", status: "open", created: "2026-09-30", plan: "2026-10-01", due: "",
    text: "找 Yige 要她那边的报销" },
];
