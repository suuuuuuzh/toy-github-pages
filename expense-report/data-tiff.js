// 报销单 · TIFF 多伦多电影节 —— 境外行程花销，随发随记
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

const expenseItems = [];

const tpiaoList = [];
