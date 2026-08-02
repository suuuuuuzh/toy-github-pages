#!/usr/bin/env python3
# 按公司「实支单」模板生成报销单 Excel（格式参照 廿一影视 实支单公式版）。
# 用法：python3 tools/gen_shizhidan.py <bakefiles.json> <输出目录>
import json
import os
import sys
from datetime import datetime

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, Side
from openpyxl.utils import get_column_letter

FONT = "宋体"
THIN = Side(style="thin")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
COMPANY = "廿一影视文化传播（上海）有限公司"
PROJECT = "电影《竹林遗录》"
WIDTHS = {"A": 5.8, "B": 12.3, "C": 12.7, "D": 9.5, "E": 38.0, "F": 9.2, "G": 12.5, "H": 11.3}

# 大写金额公式（与模板一致），{r} 换成合计所在行
UPPER = ('=IF(ROUND(G{r},2)<0,"无效数值",IF(ROUND(G{r},2)=0,"零",IF(ROUND(G{r},2)<1,"",TEXT(INT(ROUND(G{r},2)),"[dbnum2]")&"元")'
         '&IF(INT(ROUND(G{r},2)*10)-INT(ROUND(G{r},2))*10=0,IF(INT(ROUND(G{r},2))*(INT(ROUND(G{r},2)*100)-INT(ROUND(G{r},2)*10)*10)=0,"","零"),'
         'TEXT(INT(ROUND(G{r},2)*10)-INT(ROUND(G{r},2))*10,"[dbnum2]")&"角")&IF((INT(ROUND(G{r},2)*100)-INT(ROUND(G{r},2)*10)*10)=0,"整",'
         'TEXT((INT(ROUND(G{r},2)*100)-INT(ROUND(G{r},2)*10)*10),"[dbnum2]")&"分")))')


def frame(ws, coord):
    """只给（可能是合并区里的）单元格描边，不写值。"""
    ws[coord].border = BOX


def put(ws, coord, value, size=11, bold=False, align="center", box=False, wrap=False, fmt=None):
    c = ws[coord]
    if value is not None:
        c.value = value
    c.font = Font(name=FONT, size=size, bold=bold)
    c.alignment = Alignment(horizontal=align, vertical="center", wrap_text=wrap)
    if box:
        c.border = BOX
    if fmt:
        c.number_format = fmt
    return c


def build(ws, title, rows, loan, report_date):
    for col, w in WIDTHS.items():
        ws.column_dimensions[col].width = w

    ws.merge_cells("A1:E2")
    put(ws, "A1", COMPANY, size=18, bold=True, align="left")
    put(ws, "A4", PROJECT, size=12, bold=True, align="left")
    put(ws, "F4", "实支单编号：", align="left")
    put(ws, "A5", "实支单", size=12, bold=True, align="left")
    put(ws, "F5", "报销日期：", align="left")
    put(ws, "G5", report_date, align="left", fmt="yyyy/m/d")
    put(ws, "A7", "部门：", align="left")
    put(ws, "D7", "姓名：水素", align="left")
    put(ws, "F7", "职务：", align="left")
    ws.merge_cells("G7:H7")
    put(ws, "A8", title, size=11, bold=True, align="left")

    head = 9
    ws.merge_cells(f"D{head}:E{head}")
    for coord, text in (("A", "序号"), ("B", "支付日期"), ("C", "景名/人物"), ("D", "支出项目用途（请填写清楚）"),
                        ("F", "单据数量"), ("G", "金额"), ("H", "预算编号")):
        put(ws, f"{coord}{head}", text, box=True)
    frame(ws, f"E{head}")

    r = head + 1
    for idx, (date, cat, desc, amount, ndocs) in enumerate(rows, 1):
        ws.merge_cells(f"D{r}:E{r}")
        put(ws, f"A{r}", idx, box=True)
        put(ws, f"B{r}", date, box=True, fmt="yyyy/m/d" if isinstance(date, datetime) else None)
        put(ws, f"C{r}", cat, box=True)
        put(ws, f"D{r}", desc, box=True, align="left", wrap=True)
        frame(ws, f"E{r}")
        put(ws, f"F{r}", ndocs, box=True)
        put(ws, f"G{r}", amount, box=True, fmt="#,##0.00")
        put(ws, f"H{r}", "", box=True)
        ws.row_dimensions[r].height = 20
        r += 1

    last = r - 1
    total_row = r + 1
    put(ws, f"A{total_row}", "付款总额：(A) 人民币大写：", align="left")
    put(ws, f"D{total_row}", UPPER.format(r=total_row), align="left")
    put(ws, f"F{total_row}", "￥：", align="right")
    put(ws, f"G{total_row}", f"=SUM(G{head + 1}:G{last})", bold=True, fmt="#,##0.00", box=True)

    r = total_row + 1
    put(ws, f"A{r}", "付款方式：", align="left")
    put(ws, f"D{r}", "借款金额（如有借款）：（B)", align="left")
    ws.merge_cells(f"G{r}:H{r}")
    put(ws, f"G{r}", loan, fmt="#,##0.00")
    loan_row = r

    r += 1
    put(ws, f"B{r}", "1、现金", align="left")
    put(ws, f"D{r}", "净付金额：(A)-(B)", align="left")
    ws.merge_cells(f"G{r}:H{r}")
    put(ws, f"G{r}", f"=IF(G{total_row}-G{loan_row}>0,G{total_row}-G{loan_row},0)", fmt="#,##0.00")

    r += 1
    put(ws, f"B{r}", "2、支票", align="left")
    put(ws, f"D{r}", "退还借款金额：(B)-(A)", align="left")
    ws.merge_cells(f"G{r}:H{r}")
    put(ws, f"G{r}", f"=IF(G{loan_row}-G{total_row}>0,G{loan_row}-G{total_row},0)", fmt="#,##0.00")

    r += 1
    put(ws, f"B{r}", "3、汇款", align="left")
    put(ws, f"D{r}", "备注：", align="left")
    ws.merge_cells(f"G{r}:H{r}")

    r += 2
    ws.merge_cells(f"A{r}:B{r}")
    put(ws, f"A{r}", "制片主任/日期：", align="left")
    put(ws, f"E{r}", "部门主管/日期：", align="left")
    put(ws, f"F{r}", "经办人/日期：", align="left")
    r += 1
    put(ws, f"A{r}", "执行制片人/日期：", align="left")
    put(ws, f"E{r}", "制片人/日期：", align="left")
    put(ws, f"F{r}", "总制片人/日期：", align="left")
    r += 1
    put(ws, f"A{r}", "财务审核/日期：", align="left")
    put(ws, f"E{r}", "财务制单/日期：", align="left")
    put(ws, f"F{r}", "领款人/日期：", align="left")


def to_rows(raw):
    out = []
    for iid, date, desc, amount, invamt, cat, files in raw:
        d = None
        if date:
            try:
                d = datetime.strptime(date.strip(), "%Y-%m-%d")
            except ValueError:
                d = date
        out.append((d, cat or "", (desc or cat or "").strip(), amount or 0, len(files)))
    return out


def main():
    bake = json.load(open(sys.argv[1], encoding="utf-8"))
    outdir = sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    today = datetime(2026, 8, 2)
    specs = [
        ("k", "堪景（贵州+山东）2026年5月", 5000, "实支单-A堪景贵州山东5月.xlsx"),
        ("s", "上海+杭州 2026年6月", 0, "实支单-B上海杭州6月.xlsx"),
    ]
    made = []
    for key, title, loan, fname in specs:
        wb = Workbook()
        ws = wb.active
        ws.title = "实支单"
        build(ws, title, to_rows(bake[key]["rows"]), loan, today)
        path = os.path.join(outdir, fname)
        wb.save(path)
        made.append(path)
        print("wrote", path, len(bake[key]["rows"]), "rows")

    # 合并版：两张表连在一起，作为「一次报销」的总实支单
    wb = Workbook()
    ws = wb.active
    ws.title = "实支单"
    allrows = to_rows(bake["k"]["rows"]) + to_rows(bake["s"]["rows"])
    build(ws, "堪景（5月）+ 上海杭州（6月）合并", allrows, 5000, today)
    path = os.path.join(outdir, "实支单-合并总表.xlsx")
    wb.save(path)
    made.append(path)
    print("wrote", path, len(allrows), "rows")
    return made


if __name__ == "__main__":
    main()
