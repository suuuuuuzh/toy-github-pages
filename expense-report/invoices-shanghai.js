// shanghai 发票清单
const invoiceList = [
 {
  "file": "invoices/shanghai/lx-sh-asia-389.jpg",
  "date": "2026-06-20",
  "merchant": "亚洲新故事创投报名费",
  "amount": 389.63,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/lx-sh-dinner-319.pdf",
  "date": "2026-06-10",
  "merchant": "电影节晚餐",
  "amount": 319.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/lx-sh-hk-431.jpg",
  "date": "2026-06-19",
  "merchant": "香港电影节创投报名费",
  "amount": 431.71,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/lx-sh-lunch-48.jpg",
  "date": "2026-06-10",
  "merchant": "电影节彩排午餐",
  "amount": 48.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-001.pdf",
  "date": "2026-06-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-002.pdf",
  "date": "2026-06-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-003.pdf",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-004.pdf",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-005.pdf",
  "date": "2026-06-26",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-006.pdf",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-007.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-008.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-009.pdf",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-010.pdf",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-011.pdf",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-012.pdf",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-013.pdf",
  "date": "2026-07-07",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-014.pdf",
  "date": "",
  "merchant": "263720000032_6889472",
  "amount": 317.93,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-015.pdf",
  "date": "",
  "merchant": "北京漫荟萃餐饮服务有限公司",
  "amount": 20.9,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-016.pdf",
  "date": "",
  "merchant": "北京漫荟萃餐饮服务有限公司",
  "amount": 17.3,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-017.pdf",
  "date": "",
  "merchant": "北京漫荟萃餐饮服务有限公司",
  "amount": 17.3,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-018.pdf",
  "date": "",
  "merchant": "北京三里屯在望餐饮管理有限公司",
  "amount": 45.3,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-019.pdf",
  "date": "",
  "merchant": "北京木维莫可餐饮管理有限公司",
  "amount": 48.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-020.pdf",
  "date": "",
  "merchant": "北京蓁果餐饮管理有限公司",
  "amount": 20.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-021.pdf",
  "date": "",
  "merchant": "东部新区樊薯薯小吃店（个体工商户）",
  "amount": 15.3,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-022.pdf",
  "date": "",
  "merchant": "东部新区樊薯薯小吃店（个体工商户）",
  "amount": 15.3,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-023.pdf",
  "date": "",
  "merchant": "云岩区乔治咖啡文昌店",
  "amount": 66.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-024.pdf",
  "date": "",
  "merchant": "廿一影视文化传播（上海）有限公司120.",
  "amount": 120.8,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-025.pdf",
  "date": "",
  "merchant": "廿一影视文化传播（上海）有限公司187.",
  "amount": 187.8,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-026.pdf",
  "date": "",
  "merchant": "廿一影视文化传播（上海）有限公司70.p",
  "amount": 70.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-027.pdf",
  "date": "2026-06-12",
  "merchant": "电子发票",
  "amount": 391.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-028.pdf",
  "date": "2026-06-14",
  "merchant": "电子发票",
  "amount": 141.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-029.pdf",
  "date": "2026-06-17",
  "merchant": "华住酒店集团",
  "amount": 3328.43,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-030.pdf",
  "date": "2026-06-17",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/shanghai/z-031.pdf",
  "date": "2026-06-17",
  "merchant": "上海季阶餐饮管理有限公司",
  "amount": 470.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-032.pdf",
  "date": "2026-06-18",
  "merchant": "华住酒店集团",
  "amount": 508.16,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-033.pdf",
  "date": "2026-06-18",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/shanghai/z-034.pdf",
  "date": "2026-06-18",
  "merchant": "美团",
  "amount": 42.5,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-035.pdf",
  "date": "2026-06-22",
  "merchant": "华住酒店集团",
  "amount": 493.63,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-036.pdf",
  "date": "2026-06-22",
  "merchant": "华住酒店集团",
  "amount": 441.86,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-037.pdf",
  "date": "2026-06-22",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/shanghai/z-038.pdf",
  "date": "2026-06-22",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/shanghai/z-039.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 0.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-040.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 0.8,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-041.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 0.8,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-042.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-043.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-044.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-045.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.6,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-046.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.7,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-047.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.7,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-048.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.7,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-049.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 1.9,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-050.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 3.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-051.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 3.38,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-052.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 3.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-053.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 4.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-054.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 4.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-055.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 4.2,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-056.pdf",
  "date": "2026-06-24",
  "merchant": "美团配送费",
  "amount": 9.4,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-057.pdf",
  "date": "2026-06-24",
  "merchant": "电子发票",
  "amount": 61.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-058.pdf",
  "date": "2026-06-24",
  "merchant": "电子发票",
  "amount": 244.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-059.pdf",
  "date": "2026-06-24",
  "merchant": "电子发票",
  "amount": 141.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-060.pdf",
  "date": "2026-06-24",
  "merchant": "电子发票",
  "amount": 76.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-061.pdf",
  "date": "2026-06-24",
  "merchant": "电子发票",
  "amount": 157.7,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-062.pdf",
  "date": "2026-06-24",
  "merchant": "电子发票",
  "amount": 46.18,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-063.png",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-064.png",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-065.png",
  "date": "2026-06-24",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-066.pdf",
  "date": "2026-06-25",
  "merchant": "电子发票",
  "amount": 41.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-067.pdf",
  "date": "2026-06-25",
  "merchant": "美团",
  "amount": 21.4,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-068.pdf",
  "date": "2026-06-25",
  "merchant": "美团",
  "amount": 20.4,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-069.png",
  "date": "2026-06-25",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-070.png",
  "date": "2026-06-26",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-071.png",
  "date": "2026-06-26",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-072.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 26.9,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-073.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 46.9,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-074.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 20.2,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-075.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 20.2,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-076.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 25.2,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-077.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 19.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-078.pdf",
  "date": "2026-07-01",
  "merchant": "电子发票",
  "amount": 17.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-079.pdf",
  "date": "2026-07-01",
  "merchant": "丽水市莲都区姨妈饮品店",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-080.pdf",
  "date": "2026-07-01",
  "merchant": "廿一影视文化传播（上海）有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-081.pdf",
  "date": "2026-07-01",
  "merchant": "20260701_携程_ 电子报销凭",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-082.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-083.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-084.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-085.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-086.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-087.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-088.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-089.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-090.pdf",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-091.png",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-092.pdf",
  "date": "2026-07-01",
  "merchant": "美团",
  "amount": 0.24,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-093.pdf",
  "date": "2026-07-02",
  "merchant": "电子发票",
  "amount": 166.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-094.pdf",
  "date": "2026-07-02",
  "merchant": "电子发票",
  "amount": 45.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-095.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-096.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-097.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-098.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-099.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-100.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-101.png",
  "date": "2026-07-04",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-102.png",
  "date": "2026-07-04",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-103.png",
  "date": "2026-07-04",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-104.ofd",
  "date": "2026-07-05",
  "merchant": "电子发票",
  "amount": 67.6,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-105.pdf",
  "date": "2026-07-05",
  "merchant": "电子发票",
  "amount": 67.6,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-106.ofd",
  "date": "2026-07-06",
  "merchant": "电子发票",
  "amount": 227.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-107.pdf",
  "date": "2026-07-06",
  "merchant": "电子发票",
  "amount": 227.0,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-108.ofd",
  "date": "2026-07-06",
  "merchant": "北京星未望新天枢餐饮管理有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-109.pdf",
  "date": "2026-07-06",
  "merchant": "北京星未望新天枢餐饮管理有限公司",
  "amount": 21.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-110.ofd",
  "date": "2026-07-06",
  "merchant": "北京艾恰餐饮服务有限公司",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-111.pdf",
  "date": "2026-07-06",
  "merchant": "北京艾恰餐饮服务有限公司",
  "amount": 23.5,
  "kind": "发票"
 },
 {
  "file": "invoices/shanghai/z-112.pdf",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-113.png",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-114.png",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-115.png",
  "date": "2026-07-06",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-116.png",
  "date": "2026-07-07",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-117.pdf",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-118.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-119.png",
  "date": "2026-07-02",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-120.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-121.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/shanghai/z-122.png",
  "date": "2026-07-03",
  "merchant": "美团",
  "amount": null,
  "kind": "美团开票通知"
 }
];

const invoiceZip = "invoices/shanghai-all.zip";
