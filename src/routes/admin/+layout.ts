// The admin area is dynamic (auth, server actions) — never prerender it. The
// public marketing routes stay prerendered (root +layout.ts).
export const prerender = false;
export const ssr = true;
