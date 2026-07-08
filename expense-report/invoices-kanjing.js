// 堪景发票清单（托管在 invoices/kanjing/，供人工对应）
const invoiceList = [
 {
  "file": "invoices/kanjing/inv-001.pdf",
  "date": "2026-05-19",
  "merchant": "北京天恒常湘餐饮有限公司",
  "amount": 229.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-002.pdf",
  "date": "2026-05-24",
  "merchant": "携程",
  "amount": 2445.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-003.pdf",
  "date": "2026-05-24",
  "merchant": "贵阳云岩约强鱿鱼炖鸡店",
  "amount": 295.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-004.pdf",
  "date": "2026-05-24",
  "merchant": "贵州凯希尼酒店管理有限公司",
  "amount": 840.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-005.png",
  "date": "2026-05-25",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-006.pdf",
  "date": "2026-05-26",
  "merchant": "华住酒店集团",
  "amount": 255.8,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-007.pdf",
  "date": "2026-05-26",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/kanjing/inv-008.pdf",
  "date": "2026-05-27",
  "merchant": "华住酒店集团",
  "amount": 246.37,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-009.pdf",
  "date": "2026-05-27",
  "merchant": "华住酒店集团",
  "amount": 263.82,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-010.pdf",
  "date": "2026-05-27",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/kanjing/inv-011.pdf",
  "date": "2026-05-27",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/kanjing/inv-012.pdf",
  "date": "2026-05-27",
  "merchant": "电子发票",
  "amount": 1.82,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-013.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 1.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-014.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 1.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-015.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 1.5,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-016.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 2.5,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-017.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 31.7,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-018.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 4.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-019.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 7.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-020.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 67.5,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-021.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 58.52,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-022.pdf",
  "date": "2026-05-28",
  "merchant": "电子发票",
  "amount": 74.94,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-023.pdf",
  "date": "2026-05-28",
  "merchant": "",
  "amount": 23.0,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-024.pdf",
  "date": "2026-05-28",
  "merchant": "",
  "amount": 67.9,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-025.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-026.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-027.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-028.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-029.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-030.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-031.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-032.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-033.png",
  "date": "2026-05-28",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-034.pdf",
  "date": "2026-05-29",
  "merchant": "",
  "amount": 36.7,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-035.pdf",
  "date": "2026-05-29",
  "merchant": "",
  "amount": 51.3,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-036.pdf",
  "date": "2026-05-29",
  "merchant": "",
  "amount": 65.82,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-037.pdf",
  "date": "2026-05-30",
  "merchant": "华住酒店集团",
  "amount": 495.57,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-038.pdf",
  "date": "2026-05-30",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 },
 {
  "file": "invoices/kanjing/inv-039.pdf",
  "date": "2026-05-30",
  "merchant": "电子发票",
  "amount": 37.2,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-040.pdf",
  "date": "2026-05-30",
  "merchant": "电子发票",
  "amount": 40.2,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-041.pdf",
  "date": "2026-05-30",
  "merchant": "电子发票",
  "amount": 59.93,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-042.png",
  "date": "2026-05-30",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-043.png",
  "date": "2026-05-30",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-044.png",
  "date": "2026-05-30",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-045.png",
  "date": "2026-06-01",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-046.png",
  "date": "2026-06-01",
  "merchant": "",
  "amount": null,
  "kind": "美团开票通知"
 },
 {
  "file": "invoices/kanjing/inv-047.pdf",
  "date": "2026-06-04",
  "merchant": "携程",
  "amount": null,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-048.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": null,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-049.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": null,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-050.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": null,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-051.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": null,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-052.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": 507.41,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-053.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": 8.03,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-054.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": 156.5,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-055.pdf",
  "date": "2026-06-04",
  "merchant": "滴滴出行",
  "amount": 27.7,
  "kind": "行程单"
 },
 {
  "file": "invoices/kanjing/inv-056.pdf",
  "date": "2026-06-12",
  "merchant": "华住酒店集团",
  "amount": 1211.28,
  "kind": "发票"
 },
 {
  "file": "invoices/kanjing/inv-057.pdf",
  "date": "2026-06-12",
  "merchant": "华住酒店集团",
  "amount": null,
  "kind": "结账单"
 }
];
