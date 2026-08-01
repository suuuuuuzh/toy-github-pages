#!/usr/bin/env python3
# 把「导出全部改动」JSON 固化进 data-*.js：挂载/移除/共用抵票传播/抵票标记/顺序/删除。
import json, hashlib, os, re, sys

TAG_RE = re.compile(r'\d+(?:/\d+)*\s*共用\s*\d*\s*抵票')

def bake(export_path, data_path, label):
    exp = json.load(open(export_path))
    items = exp['items']
    att = {str(k): v for k, v in exp['attachments'].items()}
    det = {str(k): v for k, v in exp['detached'].items()}
    dipiao = set(exp['dipiao'])
    order = exp['order']
    md5cache = {}
    def filemd5(p):
        if p not in md5cache:
            md5cache[p] = hashlib.md5(open(p,'rb').read()).hexdigest() if os.path.exists(p) else None
        return md5cache[p]
    missing = []
    for it in items:
        iid = str(it['id'])
        files = []
        for f in ([it.get('invoiceFile')] + (it.get('invoiceFiles') or [])):
            if f and f not in files: files.append(f)
        for f in att.get(iid, []):
            if f not in files: files.append(f)
        removed = set(det.get(iid, []))
        files = [f for f in files if f not in removed and not f.startswith('upload:')]
        seen, out = set(), []
        for f in files:
            h = filemd5(f)
            if h is None: missing.append((it['id'], it.get('description') or it.get('category'), f)); continue
            if h in seen: continue
            seen.add(h); out.append(f)
        it['_files'] = out
    pos = {iid: i for i, iid in enumerate(order)}
    items.sort(key=lambda it: pos.get(it['id'], 9999))
    by_disp = {i + 1: it for i, it in enumerate(items)}
    groups = {}
    for it in items:
        for field in ('remark', 'invoiceCategory'):
            m = TAG_RE.search(it.get(field) or '')
            if m: groups.setdefault(m.group(0).replace(' ', ''), []).append(it)
    is_dp = lambda f: ('抵票' in os.path.basename(f)) or ('替票' in os.path.basename(f))
    props = 0
    for tag, members in groups.items():
        if len(members) == 1:
            nums = [int(x) for x in re.findall(r'\d+', tag.split('共用')[0].replace('383940', '38/39/40'))]
            for n in nums:
                t = by_disp.get(n)
                if t and t not in members: members.append(t)
        shared = []
        for m in members:
            for f in m['_files']:
                if is_dp(f) and f not in shared: shared.append(f)
        for m in members:
            have = {filemd5(x) for x in m['_files']}
            for f in shared:
                if filemd5(f) and filemd5(f) not in have:
                    m['_files'].append(f); props += 1
    for it in items:
        if TAG_RE.search(it.get('invoiceCategory') or ''): it['invoiceCategory'] = ''
    def emit(it):
        files = it['_files']
        invfs = ', '.join(f'"{x}"' for x in files[1:])
        ia = it.get('invoiceAmount')
        iamt = '""' if ia in ('', None) else ('%g' % ia)
        flag = '\n    dipiaoFlag: true,' if it['id'] in dipiao else ''
        q = lambda s: (s or '').replace('"','\\"')
        return ('  {\n'
            f'    id: {it["id"]},\n    category: "{q(it.get("category"))}",\n    description: "{q(it.get("description"))}",\n'
            f'    date: "{q(it.get("date"))}",\n    amount: {"%g" % (it.get("amount") or 0)},\n'
            f'    voucherType: "{"invoice" if files else "none"}",\n    invoiceFile: "{files[0] if files else ""}",\n'
            f'    invoiceFiles: [{invfs}],\n    invoiceCategory: "{q(it.get("invoiceCategory"))}",\n'
            f'    invoiceAmount: {iamt},\n    tpiaoIds: [],{flag}\n    remark: "{q(it.get("remark"))}",\n  }},')
    old = open(data_path, encoding='utf-8').read()
    head = old.split('const expenseItems = [')[0]
    open(data_path, 'w', encoding='utf-8').write(head + 'const expenseItems = [\n' + '\n'.join(emit(it) for it in items) + '\n];\n\nconst tpiaoList = [];\n')
    total = round(sum(it.get('amount') or 0 for it in items), 2)
    print(f'{label}: {len(items)} rows | total {total} | missing {len(missing)} | 共用补挂 {props}')
    for mm in missing: print('  MISSING:', mm)
    return items, total

if __name__ == '__main__':
    out = {}
    for exp, data, label in [(sys.argv[1], 'data-kanjing.js', 'k'), (sys.argv[2], 'data-shanghai.js', 's')]:
        items, total = bake(exp, data, label)
        out[label] = {'total': total,
                      'rows': [[it['id'], it.get('date'), it.get('description'), it.get('amount'), it.get('invoiceAmount'), it.get('category'), it['_files']] for it in items]}
    json.dump(out, open('/tmp/claude-0/-home-user-toy-github-pages/01c36e40-4693-5066-a6d2-b888b3bfbc26/scratchpad/bakefiles.json','w'), ensure_ascii=False)
