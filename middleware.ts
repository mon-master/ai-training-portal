export const config = {
  matcher: ['/((?!_astro|favicon|apple-touch).*)'],
};

const JWT_SECRET   = process.env.JWT_SECRET ?? 'change-me-in-vercel-env';
const PUBLIC_PATHS = ['/', '/login'];

// Base64url デコード
function fromB64url(str: string): Uint8Array {
  return Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
}

// JWT 検証
async function verifyJWT(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromB64url(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    if (!valid) return false;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.exp > Math.floor(Date.now() / 1000);

  } catch {
    return false;
  }
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  // 静的アセット・APIはスキップ
  if (
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/favicon')  ||
    url.pathname.startsWith('/api/')
  ) return;

  // パブリックページはスキップ
  if (PUBLIC_PATHS.includes(url.pathname)) return;

  // クッキーからJWTを取得して検証
  const cookies    = request.headers.get('cookie') ?? '';
  const tokenMatch = cookies.match(/ai_auth=([^;]+)/);

  if (tokenMatch) {
    const valid = await verifyJWT(tokenMatch[1]);
    if (valid) return;
  }

  // 未認証 → ログインページへ
  return new Response(null, {
    status:  302,
    headers: { 'Location': '/login' },
  });
}
