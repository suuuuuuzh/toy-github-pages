// 待办 / 提醒清单。我（Claude）按你说的"几天后提醒我做什么"往这里加，
// 页面顶部会显示提示条，手机上点「加到手机提醒」可一键导入系统日历/提醒事项。
// scope: 报销单 slug（daily/hz08/yff/kanjing/shanghai）或 "all"（所有页面都显示）
// due: YYYY-MM-DD（到期日，当天及之后会标红）
const reminderList = [
  {
    id: "yff-invoice-0814",
    scope: "yff",
    due: "2026-08-14",
    text: "青年电影周 3 笔等发票，5 个工作日后到 —— 没到就催一下",
    done: false,
  },
];
