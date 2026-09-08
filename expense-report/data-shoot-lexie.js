// 报销单 · 拍摄（Lexie）—— Lexie 的拍摄期花销，由她自己的记账会话维护，随发随记
const reportInfo = {
  reportTitle: "报销单 · 拍摄（Lexie）",
  company: "廿一影视文化传播（上海）有限公司",
  submitter: "Lexie",
  project: "《竹林遗录》",
  department: "",
  period: "拍摄期",
  reportDate: "",
  loan: 0,
};

const categoryOptions = [
  "制作人员费", "器材费", "场地及置景", "道具购买", "道具租金", "服装/发套", "演员",
  "拍摄用车", "燃油/过路/打车", "酒店", "工作人员餐饮", "差旅", "停车费", "杂费及备用金",
];

const expenseItems = [];

const tpiaoList = [];
