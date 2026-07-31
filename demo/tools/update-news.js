/**
 * Daily AI News Update Script
 * Fetches from Hacker News API, filters AI-related stories,
 * updates ai-workbench.html with 50 latest items.
 * Runs daily via GitHub Actions.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HTML_FILE = path.join(__dirname, 'ai-workbench.html');
const HISTORY_DIR = path.join(__dirname, 'history');
const MAX_ITEMS = 50;
const KEEP_EXISTING = 8;

const AI_KEYWORDS = [
  'ai ', 'artificial intelligence', 'llm', 'gpt', 'claude', 'chatgpt', 'copilot',
  'openai', 'anthropic', 'deepmind', 'google ai', 'meta ai', 'mistral', 'llama',
  'deepseek', 'diffusion', 'stable diffusion', 'midjourney', 'machine learning',
  'deep learning', 'neural net', 'agi', 'agent', 'fine-tun', 'rag', 'embedding',
  'langchain', 'prompt', 'autonomous', 'robot', 'generative', 'multimodal',
  'token', 'inference', 'sora', 'gemini', 'qwen', 'hunyuan', 'kimi', 'glm',
  'safety', 'alignment', 'benchmark'
];

function isAI(item) {
  if (!item || !item.title) return false;
  const t = item.title.toLowerCase();
  return AI_KEYWORDS.some(k => t.includes(k));
}

function httpsGet(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'AI-Workbench/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
      });
    }).on('error', (e) => {
      console.error('Fetch error:', url, e.message);
      resolve(null);
    });
  });
}

async function fetchHNStories(limit) {
  const ids = await httpsGet('https://hacker-news.firebaseio.com/v0/topstories.json');
  return (ids || []).slice(0, limit || 200);
}

async function fetchStory(id) {
  return await httpsGet(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
}

async function fetchAINews() {
  console.log('Fetching HN top stories...');
  const ids = await fetchHNStories(250);
  console.log(`Got ${ids.length} IDs`);

  const stories = [];
  for (const id of ids) {
    const story = await fetchStory(id);
    if (story && isAI(story)) stories.push(story);
    if (stories.length >= 45) break;
  }
  console.log(`Found ${stories.length} AI stories`);
  return stories;
}

function toDataItem(story, idx) {
  const now = new Date();
  // UTC 0-14范围（北京时间8-22点），确保不跨天
  const hour = Math.floor(idx * 0.4) % 15;
  const minute = Math.floor(Math.random() * 55);
  const publishedAt = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)).toISOString();

  let hostname = 'Hacker News';
  if (story.url) {
    try { hostname = new URL(story.url).hostname.replace('www.', ''); } catch(e) {}
  }

  let source;
  if (hostname.includes('github.com')) source = 'GitHub';
  else if (hostname.includes('arxiv.org')) source = 'arXiv 论文';
  else if (hostname.includes('openai.com')) source = 'OpenAI Blog';
  else if (hostname.includes('anthropic.com')) source = 'Anthropic Blog';
  else if (hostname.includes('deepmind')) source = 'Google DeepMind';
  else if (hostname.includes('news.ycombinator.com')) source = 'Hacker News 热门';
  else if (hostname.length > 25) source = hostname.substring(0, 25);
  else source = hostname;

  const score = Math.min(95, Math.round((story.score || 30) / 8) + 60);

  let category = 'industry';
  const t = story.title.toLowerCase();
  if (/\b(llm|model|release|open.?source|gpt|claude|gemini|发布|开源)\b/.test(t)) category = 'ai-models';
  else if (/\b(paper|arxiv|research|study|论文|研究)\b/.test(t)) category = 'paper';

  const summary = `HN ${story.score || 0}分 | ${story.descendants || 0}评论 | ${hostname}`;

  return {
    id: `hn_${story.id}`,
    title: story.title,
    url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
    source: source,
    publishedAt: publishedAt,
    summary: summary,
    category: category,
    score: score
  };
}

async function main() {
  console.log('=== AI Workbench Update ===');
  console.log('Time:', new Date().toISOString());

  // Read & parse HTML
  let html = fs.readFileSync(HTML_FILE, 'utf8');
  const dataMatch = html.match(/const DATA = (\[[\s\S]*?\]);/);
  let existingData = [];
  if (dataMatch) {
    try { existingData = JSON.parse(dataMatch[1]); } catch(e) { console.log('Parse warning:', e.message); }
  }
  console.log('Existing items:', existingData.length);

  // Fetch new stories
  let newStories = [];
  try { newStories = await fetchAINews(); } catch(e) { console.error('Fetch failed:', e.message); }

  const keepCount = newStories.length < 10 ? Math.min(15, existingData.length) : KEEP_EXISTING;
  const existingTop = existingData.slice(0, keepCount);
  const newItems = newStories.map((s, i) => toDataItem(s, i));

  // Merge & deduplicate
  const seen = new Set();
  const all = [...existingTop, ...newItems].filter(item => {
    const key = (item.title || '').substring(0, 25).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const final = all.slice(0, MAX_ITEMS);
  console.log(`Final: ${final.length} items`);

  // Replace in HTML
  html = html.replace(/const DATA = \[[\s\S]*?\];/, `const DATA = ${JSON.stringify(final)};`);
  fs.writeFileSync(HTML_FILE, html, 'utf8');

  // History snapshot
  const now = new Date();
  const ds = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true });
  fs.writeFileSync(path.join(HISTORY_DIR, `${ds}.json`), JSON.stringify(final, null, 2), 'utf8');
  console.log('History saved:', ds);
  console.log('=== Done ===');
}

main().catch(e => { console.error(e); process.exit(1); });
