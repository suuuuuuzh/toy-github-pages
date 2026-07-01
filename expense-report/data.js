// ============================================================
// 报销单数据文件 —— 在这里维护你的报销信息
// 每次报销只需要修改这个文件，index.html 会自动重新计算汇总。
// ============================================================

// 报销单基本信息
const reportInfo = {
  reportTitle: "报销单",
  submitter: "周淑涵",
  department: "",
  period: "2026年6月",
  reportDate: "2026-07-01",
};

// 报销明细列表
// voucherType 只能是三种之一：
//   "invoice"  —— 有正式发票，填 invoiceFile（发票文件放进 invoices/ 文件夹）
//   "tpiao"    —— 没有发票，走 T 票，填 tpiaoId（如 "T001"）
//   "none"     —— 既没有发票也没有 T 票（会在页面上高亮提示，需要补充凭证）
const expenseItems = [
  {
    id: 1,
    category: "交通费",
    description: "机场往返打车",
    date: "2026-06-20",
    amount: 128.0,
    voucherType: "invoice",
    invoiceFile: "invoices/001-taxi.pdf",
    tpiaoId: "",
    remark: "",
  },
  {
    id: 2,
    category: "餐饮费",
    description: "客户招待午餐",
    date: "2026-06-21",
    amount: 356.5,
    voucherType: "invoice",
    invoiceFile: "invoices/002-meal.pdf",
    tpiaoId: "",
    remark: "",
  },
  {
    id: 3,
    category: "交通费",
    description: "市内打车（无票，走T票）",
    date: "2026-06-22",
    amount: 45.0,
    voucherType: "tpiao",
    invoiceFile: "",
    tpiaoId: "T001",
    remark: "",
  },
  {
    id: 4,
    category: "交通费",
    description: "市内打车（无票，走T票）",
    date: "2026-06-23",
    amount: 32.0,
    voucherType: "tpiao",
    invoiceFile: "",
    tpiaoId: "T001",
    remark: "",
  },
  {
    id: 5,
    category: "住宿费",
    description: "出差住宿（无票，走T票）",
    date: "2026-06-24",
    amount: 420.0,
    voucherType: "tpiao",
    invoiceFile: "",
    tpiaoId: "T002",
    remark: "",
  },
];

// T票扫描件（可选）：如果某张 T 票有扫描件，放进 invoices/ 文件夹后在这里对应上
// 键是 T票编号，值是文件路径
const tpiaoFiles = {
  T001: "",
  T002: "",
};
