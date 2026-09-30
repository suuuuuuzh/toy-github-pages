// 报销单 · TIFF 多伦多电影节 —— 境外行程花销，随发随记（即黑豆加拿大 travel，威姐 sponsor）
// 外币：amount 填折算后的人民币，原币金额和汇率写进 remark（如「CAD 45.00 @4.95」）
const reportInfo = {
  reportTitle: "报销单 · TIFF 多伦多电影节",
  company: "廿一影视文化传播（上海）有限公司",
  submitter: "水素",
  project: "《竹林遗录》",
  department: "",
  period: "TIFF（多伦多电影节）",
  reportDate: "",
  loan: 0,
};

const categoryOptions = [
  "国际机票", "签证费", "保险", "住宿费", "境外市内交通", "餐费",
  "电影节报名费", "展会/活动费", "宣传物料", "业务招待费",
  "通讯费（境外流量）", "办公用品", "快递费", "其他",
];

const expenseItems = [
  {
    id: 1,
    category: "通讯费（境外流量）",
    description: "境外 eSIM 流量（nomadesim.com）",
    date: "2026-09-12",
    amount: 192.84,
    voucherType: "none",
    invoiceFile: "",
    invoiceCategory: "",
    tpiaoIds: [],
    remark: "USD 28.75 @6.7076（Apple Card）",
  },
  {
    id: 2,
    category: "展会/活动费",
    description: "TIFF 多伦多电影节票",
    date: "2026-09-12",
    amount: 373.41,
    voucherType: "none",
    invoiceFile: "",
    invoiceCategory: "",
    tpiaoIds: [],
    remark: "USD 55.67 @6.7076（Apple Card）",
  },
  {
    id: 3,
    category: "餐费",
    description: "Ka Chi Korean Restaurant，Toronto",
    date: "2026-09-17",
    amount: 542.78,
    voucherType: "none",
    invoiceFile: "",
    invoiceCategory: "",
    tpiaoIds: [],
    remark: "USD 80.92 @6.7076（Apple Card）",
  },
  {
    id: 4,
    category: "餐费",
    description: "Small Pot Restaurant，North York",
    date: "2026-09-18",
    amount: 219.88,
    voucherType: "none",
    invoiceFile: "",
    invoiceCategory: "",
    tpiaoIds: [],
    remark: "USD 32.78 @6.7076（Apple Card）",
  },
];

const tpiaoList = [];
