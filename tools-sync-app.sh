#!/bin/sh
# 两个站点共用同一套前端代码（app.js / upload.js / xlsx-export.js / style.css）。
# 在 expense-report/ 改完后跑这个脚本同步到 supernova/。站点差异全在各自的 site-config.js 里。
set -e
cd "$(dirname "$0")"
for f in app.js upload.js xlsx-export.js style.css; do
  cp "expense-report/$f" "supernova/$f"
  echo "synced $f"
done
cp expense-report/tools/gen_extra_manifest.py supernova/tools/gen_extra_manifest.py
echo "synced gen_extra_manifest.py"
