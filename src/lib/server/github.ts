/**
 * Git-backed content store: commit `content.json` to the repo via the GitHub
 * Contents API. The push triggers `deploy.yml` → Cloudflare Pages rebuild, so
 * the edit goes live on the next build (~1–2 min). Every save is a git commit —
 * the free, revertable audit trail.
 *
 * Edge-safe (fetch + Web Crypto only). Token is a fine-grained PAT scoped to this
 * repo with Contents: read/write, read from `$env/dynamic/private`.
 */
import { env } from '$env/dynamic/private';

const CONTENT_PATH = 'src/lib/content/content.json';

export interface CommitResult {
	commitSha: string;
	commitUrl: string;
}

function config() {
	const token = env.GITHUB_TOKEN;
	const repo = env.GITHUB_REPO; // "owner/name"
	const branch = env.GITHUB_BRANCH || 'main';
	if (!token || !repo) {
		throw new Error('Content save is not configured (GITHUB_TOKEN / GITHUB_REPO).');
	}
	return { token, repo, branch };
}

const headers = (token: string) => ({
	Authorization: `Bearer ${token}`,
	Accept: 'application/vnd.github+json',
	'X-GitHub-Api-Version': '2022-11-28',
	'User-Agent': 'camping4you-admin'
});

/** Base64-encode UTF-8 JSON (edge-safe, no Node Buffer). */
function toBase64(text: string): string {
	const bytes = new TextEncoder().encode(text);
	let bin = '';
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin);
}

/** Commit a new content.json. Reads the current blob SHA first (required by the API). */
export async function commitContent(content: unknown, actorEmail: string): Promise<CommitResult> {
	const { token, repo, branch } = config();
	const api = `https://api.github.com/repos/${repo}/contents/${CONTENT_PATH}`;

	// Current SHA (the file always exists in the repo).
	const cur = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers: headers(token) });
	if (!cur.ok) {
		throw new Error(`GitHub read failed (${cur.status}): ${await cur.text()}`);
	}
	const { sha } = (await cur.json()) as { sha: string };

	const json = JSON.stringify(content, null, '\t') + '\n';
	const put = await fetch(api, {
		method: 'PUT',
		headers: { ...headers(token), 'Content-Type': 'application/json' },
		body: JSON.stringify({
			message: `content: update park content via admin\n\nEdited by ${actorEmail}`,
			content: toBase64(json),
			sha,
			branch
		})
	});
	if (!put.ok) {
		throw new Error(`GitHub commit failed (${put.status}): ${await put.text()}`);
	}
	const res = (await put.json()) as { commit: { sha: string; html_url: string } };
	return { commitSha: res.commit.sha, commitUrl: res.commit.html_url };
}
