// 报销单 · 青年电影周 —— 每日花销随发随记
const reportInfo = {
  reportTitle: "报销单 · 青年电影周",
  company: "廿一影视文化传播（上海）有限公司",
  submitter: "水素",
  project: "《竹林遗录》",
  department: "",
  period: "青年电影周",
  reportDate: "",
  loan: 0,
};

const categoryOptions = [
  "交通费", "住宿费", "餐费", "汽车费用", "快递费", "办公用品", "器材", "业务招待费", "其他",
];

const expenseItems = [
  {
    id: 1,
    category: "交通费",
    description: "水素高铁往返，北京-石家庄",
    date: "2026-08-04",
    amount: 281,
    voucherType: "invoice",
    invoiceFile: "invoices/extra/2026-08-04_水素高铁往返，北京-石家庄_实付0-1.pdf",
    invoiceFiles: ["invoices/extra/2026-08-04_水素高铁往返，北京-石家庄_实付0-2.pdf"],
    invoiceCategory: "交通费",
    invoiceAmount: 281,
    tpiaoIds: [],
    remark: "",
  },
  {
    id: 2,
    category: "餐费",
    description: "青年电影周晚饭，2人",
    date: "2026-08-04",
    amount: 250,
    voucherType: "invoice",
    invoiceFile: "invoices/extra/2026-08-04_青年电影周晚饭，2人_实付250.pdf",
    invoiceFiles: [],
    invoiceCategory: "餐饮费",
    invoiceAmount: 250,
    tpiaoIds: [],
    remark: "路演抵达日晚饭",
  },
  {
    id: 3,
    category: "交通费",
    description: "往返高铁站+往返青年电影周颁奖打车",
    date: "2026-08-08",
    amount: 196.7,
    voucherType: "invoice",
    invoiceFile: "invoices/extra/2026-08-08_往返高铁站+往返青年电影周颁奖打车_实付196.7-1.pdf",
    invoiceFiles: ["invoices/extra/2026-08-08_往返高铁站+往返青年电影周颁奖打车_实付196.7-2.pdf"],
    invoiceCategory: "交通费",
    invoiceAmount: 197.6,
    tpiaoIds: [],
    remark: "",
  },
];

const tpiaoList = [];
