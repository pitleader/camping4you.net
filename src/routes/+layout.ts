// The marketing site is fully static — prerender every route. M2/M3 server
// routes (Telnyx webhook, OIDC-gated control panel) will opt out individually.
export const prerender = true;
