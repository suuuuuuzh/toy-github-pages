// 预算表（可选）。填了之后每张表的表头和类目汇总会显示 预算/已花/剩余。
// 例：{ code:"A", name:"市场推广", sheet:"default", total:50000, items:[{name:"广告投放",amount:30000}] }
const budgetPlan = { project: "supernova studio", grandTotal: 0, sections: [] };

function budgetForSheet(slug) {
  if (typeof budgetPlan === "undefined") return null;
  return budgetPlan.sections.filter((s) => s.sheet === slug)[0] || null;
}
