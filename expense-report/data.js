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

// 费用类目——统一用这几种（和公司报销单模板保持一致，category 字段请从这里面选）：
const categoryOptions = [
  "交通费",
  "差旅-交通",
  "住宿费",
  "餐费",
  "汽车费用",
  "快递费",
  "办公用品",
  "业务招待费",
  "其他",
];

// 报销明细列表
// voucherType 只能是三种之一：
//   "invoice"  —— 有正式发票，填 invoiceFile（发票文件放进 invoices/ 文件夹）和 invoiceCategory
//                 （发票类型/发票内容，即发票上写的服务类别，例如"客运服务费""住宿费""餐票""
//                 过路费""停车费""油票""定额发票""核酸检测"等）。
//   "tpiao"    —— 没有发票，用别的发票/收据来抵（替票，正式说法是"抵票"）。
//                 一笔费用可能要凑好几张不同的替票才够，
//                 所以这里填 tpiaoIds（数组），可以填一个或多个替票编号，
//                 例如 ["T001"] 或 ["T002", "T003"]。
//                 同一张替票编号也可以被好几笔不同的费用共用。
//                 每张替票自己的面值、发票类型、扫描件在下面的 tpiaoList 里单独维护。
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
    invoiceCategory: "客运服务费",
    tpiaoIds: [],
    remark: "",
  },
  {
    id: 2,
    category: "业务招待费",
    description: "客户招待午餐",
    date: "2026-06-21",
    amount: 356.5,
    voucherType: "invoice",
    invoiceFile: "invoices/002-meal.pdf",
    invoiceCategory: "餐票",
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
    invoiceCategory: "",
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
    invoiceCategory: "",
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
    invoiceCategory: "",
    tpiaoIds: ["T002", "T003"], // 一笔费用用了两张不同的替票
    remark: "",
  },
  {
    id: 6,
    category: "办公用品",
    description: "打印耗材",
    date: "2026-06-25",
    amount: 89.0,
    voucherType: "none",
    invoiceFile: "",
    invoiceCategory: "",
    tpiaoIds: [],
    remark: "凭证暂缺，需补充",
  },
];

// 替票（抵票）清单 —— 替票自己的信息，和上面 expenseItems 是多对多关系：
// 一张替票可以抵好几笔费用，一笔费用也可以用好几张替票合起来抵。
// amount 是这张替票本身的面值（不是它抵的那笔费用的金额）。
// invoiceCategory 是这张替票自己的发票内容（页面上会自动显示成"抵票-XXX"）。
const tpiaoList = [
  { id: "T001", amount: 77.0, invoiceCategory: "网约车", file: "", note: "" },
  { id: "T002", amount: 300.0, invoiceCategory: "酒", file: "", note: "" },
  { id: "T003", amount: 120.0, invoiceCategory: "客运服务费", file: "", note: "" },
];
