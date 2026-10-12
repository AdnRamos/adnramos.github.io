// Busca os dados públicos do GitHub e grava em data/repos.json.
// Uso: node scripts/sync-github.mjs   (GITHUB_TOKEN opcional, evita rate limit)
import { writeFile, mkdir } from 'node:fs/promises';

const USER = process.env.GH_USER || 'AdnRamos';
const headers = { 'User-Agent': 'portfolio-sync', Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const get = async (url) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
};

const user = await get(`https://api.github.com/users/${USER}`);
const repos = await get(`https://api.github.com/users/${USER}/repos?per_page=100&type=owner&sort=pushed`);

const kept = repos.filter((r) => !r.fork && !r.archived);

// linguagens (bytes somados em todos os repositórios públicos próprios)
const langBytes = {};
for (const r of kept) {
  try {
    const l = await get(`https://api.github.com/repos/${USER}/${r.name}/languages`);
    for (const [k, v] of Object.entries(l)) langBytes[k] = (langBytes[k] || 0) + v;
  } catch {}
}
const total = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
const languages = Object.entries(langBytes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([name, bytes]) => ({ name, percent: Math.round((bytes / total) * 1000) / 10 }));

// contribuições públicas dos últimos 12 meses (GraphQL exige token)
let contributions = null;
if (process.env.GITHUB_TOKEN) {
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: `{ user(login: "${USER}") { contributionsCollection { contributionCalendar { totalContributions } } } }` }),
    });
    const j = await res.json();
    contributions = j.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? null;
  } catch {}
}

const out = {
  updated_at: new Date().toISOString(),
  user: { public_repos: user.public_repos, followers: user.followers, created_at: user.created_at, contributions, stars: kept.reduce((a, r) => a + r.stargazers_count, 0), languages },
  repos: kept
    .map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count,
      pushed_at: r.pushed_at,
      homepage: r.homepage || null,
      url: r.html_url,
      topics: r.topics || [],
    })),
};

await mkdir('data', { recursive: true });
await writeFile('data/repos.json', JSON.stringify(out, null, 2) + '\n');
console.log(`${out.repos.length} repositórios salvos`);
