// 报销单 · 杭州八月堪景 —— 每日花销随发随记
const reportInfo = {
  reportTitle: "报销单 · 杭州八月堪景",
  company: "廿一影视文化传播（上海）有限公司",
  submitter: "水素",
  project: "《竹林遗录》",
  department: "",
  period: "2026年8月（杭州堪景）",
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
    description: "8/9 邱、赵、水三人高铁，北京-杭州",
    date: "2026-08-09",
    amount: 2004,
    voucherType: "none",
    invoiceFile: "",
    invoiceFiles: [],
    invoiceCategory: "",
    invoiceAmount: "",
    tpiaoIds: [],
    remark: "中铁网络 12306",
  },
  {
    id: 2,
    category: "其他",
    description: "驱蚊水喷雾 3瓶（堪景户外用）",
    date: "2026-08-09",
    amount: 12.3,
    voucherType: "none",
    invoiceFile: "",
    invoiceFiles: [],
    invoiceCategory: "",
    invoiceAmount: "",
    tpiaoIds: [],
    remark: "1688 绿壹(龙岩)生物技术 订单5127359942201006333，寄杭州桔子酒店前台",
  },
  {
    id: 3,
    category: "其他",
    description: "蕉下户外驱蚊器+3支驱蚊液（堪景户外用）",
    date: "2026-08-09",
    amount: 98.88,
    voucherType: "none",
    invoiceFile: "",
    invoiceFiles: [],
    invoiceCategory: "",
    invoiceAmount: "",
    tpiaoIds: [],
    remark: "闲鱼 订单5126173704369015515（二手平台，无发票）",
  },
];

const tpiaoList = [];
