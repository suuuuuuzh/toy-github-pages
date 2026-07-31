#!/usr/bin/env python3
# 重建 invoices-extra.js：扫描 invoices/extra/ 里的所有文件，
# 已有条目原样保留（文件还在的话），新文件按文件名/PDF内容猜出 商户/金额/日期/类型 后追加。
# 由 GitHub Actions 在有人往 invoices/extra/ 上传文件后自动运行，也可本地手动跑。
import hashlib
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)  # expense-report/
EXTRA_DIR = os.path.join(ROOT, "invoices", "extra")
MANIFEST = os.path.join(ROOT, "invoices-extra.js")
EXTS = (".pdf", ".png", ".jpg", ".jpeg", ".ofd")

try:
    import fitz  # PyMuPDF，可选：没装就只按文件名猜
except ImportError:
    fitz = None


def parse_existing():
    if not os.path.exists(MANIFEST):
        return []
    src = open(MANIFEST, encoding="utf-8").read()
    m = re.search(r"invoiceListExtra\s*=\s*(\[.*\]);", src, re.S)
    return json.loads(m.group(1)) if m else []


def md5(path):
    return hashlib.md5(open(path, "rb").read()).hexdigest()


def meta_from_filename(stem):
    amount = None
    m = re.search(r"(?<!\d)(\d{1,6}\.\d{1,2})(?!\d)", stem)
    if m:
        amount = float(m.group(1))
    else:
        m = re.search(r"(?:[¥￥]|[-_（(])(\d{1,6})(?:元)?[)）]?$", stem)
        if m:
            amount = float(m.group(1))
    date = None
    m = re.search(r"(20\d{2})[-_.年]?(0[1-9]|1[0-2])[-_.月]?(0[1-9]|[12]\d|3[01])(?!\d)", stem)
    if m:
        date = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    kind = "抵票" if re.search(r"替票|抵票", stem) else "发票"
    # 商户名 = 文件名去掉日期/金额后剩下的部分
    label = re.sub(r"(20\d{2})[-_.年]?(0[1-9]|1[0-2])[-_.月]?(0[1-9]|[12]\d|3[01])日?(?!\d)", "", stem)
    label = re.sub(r"(?<!\d)\d{1,6}\.\d{1,2}(?!\d)", "", label)
    label = re.sub(r"(?:[¥￥]|[-_（(])\d{1,6}(?:元)?[)）]?$", "", label)
    label = re.sub(r"[-_（()）\s]+$", "", re.sub(r"^[-_（()）\s]+", "", label)).strip("-_ ") or stem
    return amount, date, kind, label


def meta_from_pdf(path):
    if fitz is None:
        return None, None, None
    try:
        doc = fitz.open(path)
        text = doc[0].get_text()
        doc.close()
    except Exception:
        return None, None, None
    amount = date = seller = None
    m = re.search(r"（小写）\s*[¥￥]?\s*([\d,]+\.\d{2})", text)
    if m:
        amount = float(m.group(1).replace(",", ""))
    m = re.search(r"(\d{4})年(\d{2})月(\d{2})日", text)
    if m:
        date = f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    for cand in re.findall(r"[^\s：:，,]{2,30}?(?:有限公司|个体工商户）?|商行|便利店|小吃店|饮品店|咖啡[^\s]{0,6}店)", text):
        if "廿一" not in cand and "税务" not in cand and "信用" not in cand:
            seller = cand.strip("（）")
            break
    return amount, date, seller


def main():
    existing = parse_existing()
    kept = [e for e in existing if os.path.exists(os.path.join(ROOT, e["file"]))]
    known_files = {e["file"] for e in kept}
    known_md5 = {md5(os.path.join(ROOT, e["file"])) for e in kept}

    new_entries = []
    for fn in sorted(os.listdir(EXTRA_DIR)):
        if not fn.lower().endswith(EXTS):
            continue
        rel = "invoices/extra/" + fn
        if rel in known_files:
            continue
        h = md5(os.path.join(EXTRA_DIR, fn))
        if h in known_md5:  # 同一张票换个名字重复传了，跳过
            continue
        known_md5.add(h)
        stem = fn.rsplit(".", 1)[0]
        amount, date, kind, merchant = meta_from_filename(stem)
        if fn.lower().endswith(".pdf") and (amount is None or date is None):
            p_amount, p_date, p_seller = meta_from_pdf(os.path.join(EXTRA_DIR, fn))
            amount = amount if amount is not None else p_amount
            date = date or p_date
            if p_seller:
                merchant = p_seller
        new_entries.append({"file": rel, "date": date, "merchant": merchant, "amount": amount, "kind": kind})

    manifest = kept + new_entries
    out = (
        "// 追加发票库（两份报销单共用）：用户分批上传的发票，先托管在这，页面里「＋挂发票」可选\n"
        "// 本文件由 tools/gen_extra_manifest.py 自动生成：往 invoices/extra/ 传文件后 GitHub Actions 会自动更新它。\n"
        "const invoiceListExtra = " + json.dumps(manifest, ensure_ascii=False, indent=1) + ";\n"
    )
    open(MANIFEST, "w", encoding="utf-8").write(out)
    print(f"kept {len(kept)}, added {len(new_entries)}, removed {len(existing) - len(kept)} -> total {len(manifest)}")


if __name__ == "__main__":
    main()
