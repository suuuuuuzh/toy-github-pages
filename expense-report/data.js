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
//   "tpiao"    —— 没有发票，用别的发票/收据来抵（俗称"T票"/替票）。
//                 一笔费用可能要凑好几张不同的替票才够，
//                 所以这里填 tpiaoIds（数组），可以填一个或多个替票编号，
//                 例如 ["T001"] 或 ["T002", "T003"]。
//                 同一张替票编号也可以被好几笔不同的费用共用。
//                 每张替票自己的面值、扫描件在下面的 tpiaoList 里单独维护。
//   "none"     —— 既没有发票也没有替票（会在页面上高亮提示，需要补充凭证）
const expenseItems = [
  {
    id: 1,
    category: "交通费",
    description: "机场往返打车",
    date: "2026-06-20",
    amount: 128.0,
    voucherType: "invoice",
    invoiceFile: "invoices/001-taxi.pdf",
    tpiaoIds: [],
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
    tpiaoIds: [],
    remark: "",
  },
  {
    id: 3,
    category: "交通费",
    description: "市内打车（无票，用替票抵）",
    date: "2026-06-22",
    amount: 45.0,
    voucherType: "tpiao",
    invoiceFile: "",
    tpiaoIds: ["T001"],
    remark: "",
  },
  {
    id: 4,
    category: "交通费",
    description: "市内打车（无票，用替票抵）",
    date: "2026-06-23",
    amount: 32.0,
    voucherType: "tpiao",
    invoiceFile: "",
    tpiaoIds: ["T001"], // 和第3笔共用同一张替票
    remark: "",
  },
  {
    id: 5,
    category: "住宿费",
    description: "出差住宿（无票，两张替票合起来抵）",
    date: "2026-06-24",
    amount: 420.0,
    voucherType: "tpiao",
    invoiceFile: "",
    tpiaoIds: ["T002", "T003"], // 一笔费用用了两张不同的替票
    remark: "",
  },
];

// 替票（T票）清单 —— 替票自己的信息，和上面 expenseItems 是多对多关系：
// 一张替票可以抵好几笔费用，一笔费用也可以用好几张替票合起来抵。
// amount 是这张替票本身的面值（不是它抵的那笔费用的金额）。
const tpiaoList = [
  { id: "T001", amount: 77.0, file: "", note: "" },
  { id: "T002", amount: 300.0, file: "", note: "" },
  { id: "T003", amount: 120.0, file: "", note: "" },
];
