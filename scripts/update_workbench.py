#!/usr/bin/env python3
"""
AI 工作台每日数据更新脚本
- 从 AI HOT API 拉取最近 7 天精选数据
- 时间衰减排序：近3天热度加分，取前 30 条
- 保存每日快照到 history/ 目录
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
HISTORY_DIR = "demo/tools/history"
TOP_N = 30

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


def parse_datetime(s):
    """安全解析 ISO 8601 时间字符串"""
    if not s:
        return None
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except (ValueError, TypeError):
        return None


def time_weighted_score(item, now):
    """近3天热度加分：今天+30，昨天+20，前天+10，3天前+5，更早+0"""
    base_score = item.get("score", 50) or 50
    pub_at = parse_datetime(item.get("publishedAt", ""))
    if pub_at is None:
        return base_score

    diff_days = (now - pub_at).days
    if diff_days <= 0:
        return base_score + 30
    elif diff_days == 1:
        return base_score + 20
    elif diff_days == 2:
        return base_score + 10
    elif diff_days == 3:
        return base_score + 5
    return base_score


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

    # 时间衰减排序，取前 N 条
    now = datetime.now(timezone.utc)
    result.sort(key=lambda x: time_weighted_score(x, now), reverse=True)
    result = result[:TOP_N]

    return result


def format_js_array(items):
    """将 Python 数据格式化为 JavaScript 数组字符串"""
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)
    manual_filtered = []
    for m in MANUAL_ITEMS:
        pub_date = parse_datetime(m.get("publishedAt", ""))
        if pub_date and pub_date >= cutoff:
            manual_filtered.append(m)
        elif pub_date is None:
            manual_filtered.append(m)

    all_items = items + manual_filtered

    js_objects = []
    for item in all_items:
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


def save_history(items):
    """保存今日快照到 history/YYYY-MM-DD.json"""
    os.makedirs(HISTORY_DIR, exist_ok=True)
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    history_file = os.path.join(HISTORY_DIR, f"{today_str}.json")

    # 检查是否已存在（避免重复保存）
    if os.path.exists(history_file):
        print(f"History snapshot {today_str}.json already exists, skipping.")
        return

    with open(history_file, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"Saved history snapshot: {history_file}")


def update_html(html_path, new_data_js):
    """替换 HTML 中的 DATA 数组"""
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    pattern = r'const DATA = \[.*?\];'
    replacement = f'const DATA = {new_data_js};'

    match = re.search(pattern, html, re.DOTALL)
    if not match:
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

    # 2. 保存历史快照
    save_history(items)

    # 3. 格式化并更新 HTML
    new_data = format_js_array(items)
    print(f"Updating {HTML_PATH} with {len(items)} items...")
    changed = update_html(HTML_PATH, new_data)

    if changed:
        print(f"Successfully updated HTML!")
        if "GITHUB_OUTPUT" in os.environ:
            with open(os.environ["GITHUB_OUTPUT"], "a") as f:
                f.write("changed=true\n")
    else:
        print("No data changes detected, HTML unchanged.")

    print("Done.")


if __name__ == "__main__":
    main()
