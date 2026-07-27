#!/usr/bin/env python3
"""
AI 工作台每日数据更新脚本
- 从 AI HOT API 拉取最近 7 天精选数据
- 将新数据注入 ai-workbench.html
- 由 GitHub Actions 每日自动执行
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

API_URL = "https://aihot.virxact.com/api/public/items"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
HTML_PATH = "demo/tools/ai-workbench.html"

# 手动维护的国内产品数据（不在 AI HOT 覆盖范围内的补充）
MANUAL_ITEMS = [
    {
        "id": "manual_kingsoft",
        "title": "金山办公发布灵犀专业版和 WPS Comate 两款AI办公智能体",
        "url": "https://new.qq.com/rain/a/20260716A06GH000",
        "source": "金山办公 2026 AI 生产力大会",
        "publishedAt": "2026-07-16T00:00:00.000Z",
        "summary": "金山办公发布两款AI办公智能体：面向个人的「灵犀专业版」提供专属AI办公助理，面向组织的「WPS Comate」助力企业升级。灵犀专业版不只是生成内容，而是理解任务、调用文档与工作上下文，直接产出可编辑的PPT、保留公式的表格等可交付成果。CEO章庆元表示：办公软件正从单机办公、协同办公走向AI办公。",
        "category": "ai-products",
        "score": 85
    },
    {
        "id": "manual_midu1",
        "title": "蜜度发布三大垂直场景智能体：DataQ、模力通3.0、校对通2.0",
        "url": "https://www.toutiao.com/article/7664101018003620394",
        "source": "蜜度科技 WAIC 2026",
        "publishedAt": "2026-07-19T00:00:00.000Z",
        "summary": "蜜度发布三款垂直场景智能体：DataQ数据分析智能体（6分钟完成数据清洗标注并交付报告，标注准确率91.6%，报告撰写效率提升90%）；模力通3.0办公写作智能体（7分钟生成PPT，5分钟生成3万字深度报告）；校对通2.0编校审核智能体（搭载文修大模型V5.0，30B参数，差错检出率提升10%，上半年累计校对超7005万篇稿件）。",
        "category": "ai-products",
        "score": 83
    }
]


def fetch_aihot_items():
    """从 AI HOT API 拉取最近 7 天精选数据"""
    since = (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")
    url = f"{API_URL}?mode=selected&since={since}&take=100"

    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.reason}", file=sys.stderr)
        raise
    except urllib.error.URLError as e:
        print(f"URL Error: {e.reason}", file=sys.stderr)
        raise

    items = data.get("items", [])
    print(f"Fetched {len(items)} items from AI HOT (since={since})")

    # 只保留需要的字段，缺失字段给默认值
    result = []
    for item in items:
        result.append({
            "id": item.get("id", ""),
            "title": item.get("title", "") or "",
            "url": item.get("url", "") or "",
            "source": item.get("source", "") or "",
            "publishedAt": item.get("publishedAt") or "",
            "summary": item.get("summary") or "",
            "category": item.get("category") or "tip",
            "score": item.get("score") or 50
        })

    return result


def format_js_array(items):
    """将 Python 数据格式化为 JavaScript 数组字符串"""
    # 只保留 30 天内的手动条目
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    manual_filtered = []
    for m in MANUAL_ITEMS:
        pub_date = m.get("publishedAt", "")
        if pub_date:
            try:
                d = datetime.fromisoformat(pub_date.replace("Z", "+00:00"))
                if d >= cutoff:
                    manual_filtered.append(m)
            except ValueError:
                manual_filtered.append(m)
        else:
            manual_filtered.append(m)

    all_items = items + manual_filtered

    # 转换为 JS 对象字符串，压缩格式
    js_objects = []
    for item in all_items:
        # 转义标题和摘要中的特殊字符
        title = item["title"].replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
        summary = item["summary"].replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ")
        source = item["source"].replace("\\", "\\\\").replace('"', '\\"')
        url = item["url"].replace("\\", "\\\\").replace('"', '\\"')

        obj = (
            '{"id":"%s","title":"%s","url":"%s","source":"%s",'
            '"publishedAt":"%s","summary":"%s","category":"%s","score":%d}'
        ) % (item["id"], title, url, source,
             item["publishedAt"], summary, item["category"], item["score"])
        js_objects.append(obj)

    return "[" + ",".join(js_objects) + "]"


def update_html(html_path, new_data_js):
    """替换 HTML 中的 DATA 数组"""
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 匹配 const DATA = [...] 并替换
    pattern = r'const DATA = \[.*?\];'
    replacement = f'const DATA = {new_data_js};'

    # 检查是否能匹配到
    match = re.search(pattern, html, re.DOTALL)
    if not match:
        # 尝试更宽松的匹配
        pattern2 = r'const DATA = \[[\s\S]*?\];\s*\n\s*const CAT_LABELS'
        match2 = re.search(pattern2, html)
        if match2:
            replacement2 = f'const DATA = {new_data_js};\n\nconst CAT_LABELS'
            new_html = re.sub(pattern2, replacement2, html, count=1)
        else:
            print("ERROR: Could not find DATA array in HTML!", file=sys.stderr)
            sys.exit(1)
    else:
        new_html = re.sub(pattern, replacement, html, count=1, flags=re.DOTALL)

    if new_html == html:
        print("No changes detected in DATA array")
        return False

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(new_html)

    return True


def main():
    print(f"[{datetime.now().isoformat()}] Starting workbench data update...")

    # 1. 拉取数据
    print("Fetching AI HOT data...")
    try:
        items = fetch_aihot_items()
    except Exception as e:
        print(f"Failed to fetch data: {e}", file=sys.stderr)
        sys.exit(1)

    if not items:
        print("No items returned from API, aborting.")
        sys.exit(1)

    # 2. 格式化
    print(f"Formatting {len(items)} items (+ {len(MANUAL_ITEMS)} manual)...")
    new_data = format_js_array(items)

    # 3. 更新 HTML
    print(f"Updating {HTML_PATH}...")
    changed = update_html(HTML_PATH, new_data)

    if changed:
        print(f"Successfully updated with {len(items)} items!")
        # 输出到 GitHub Actions output
        if "GITHUB_OUTPUT" in os.environ:
            import os
            with open(os.environ["GITHUB_OUTPUT"], "a") as f:
                f.write("changed=true\n")
    else:
        print("No data changes detected, HTML unchanged.")

    print("Done.")


if __name__ == "__main__":
    main()
