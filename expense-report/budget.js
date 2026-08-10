// 预算表（来自 zlyl_先导片预算 Short BUDGET PLAN）——报销单的类目直接对齐预算科目，
// 每张表顶部和「费用类目汇总」里会显示 预算 / 已花 / 剩余。
// sheet: 用这套科目的报销单 slug。amount: 预算金额（0 = 预算里留空的科目）。
const budgetPlan = {
  project: "《竹林遗录》先导片",
  grandTotal: 225624,
  sections: [
    {
      code: "A",
      name: "前期制作准备（堪景）",
      sheet: "hz08",
      total: 28480,
      items: [
        { name: "堪景覆景器材费", amount: 0 },
        { name: "一般交通（打车）", amount: 750 },
        { name: "勘景车辆", amount: 1800 },
        { name: "勘景燃料费", amount: 1350 },
        { name: "过路过桥费", amount: 250 },
        { name: "停车费", amount: 450 },
        { name: "勘景餐饮", amount: 2880 },
        { name: "覆景餐饮", amount: 0 },
        { name: "杂费（水饮/补给/门票）", amount: 5000 },
        { name: "酒店", amount: 7000 },
        { name: "差旅", amount: 9000 },
        { name: "创意阐述", amount: 0 },
        { name: "脚本绘制费", amount: 0 },
        { name: "前期杂支", amount: 0 },
      ],
    },
    {
      code: "B-H",
      name: "拍摄期（制作费）",
      sheet: "shoot",
      total: 164400,
      items: [
        { name: "制作人员费", amount: 51100 },
        { name: "器材费", amount: 6000 },
        { name: "场地及置景", amount: 3500 },
        { name: "道具购买", amount: 2000 },
        { name: "道具租金", amount: 6000 },
        { name: "服装/发套", amount: 10000 },
        { name: "演员", amount: 8000 },
        { name: "拍摄用车", amount: 5500 },
        { name: "燃油/过路/打车", amount: 8000 },
        { name: "酒店", amount: 32500 },
        { name: "工作人员餐饮", amount: 4800 },
        { name: "差旅", amount: 27000 },
        { name: "停车费", amount: 0 },
        { name: "杂费及备用金", amount: 0 },
      ],
    },
  ],
};

// 当前页对应的预算科目组（没有就返回 null，页面照常用通用类目）
function budgetForSheet(slug) {
  if (typeof budgetPlan === "undefined") return null;
  return budgetPlan.sections.filter((s) => s.sheet === slug)[0] || null;
}
