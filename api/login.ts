export const config = { runtime: 'edge' };

const GAS_URL           = process.env.GAS_URL!;
const JWT_SECRET        = process.env.JWT_SECRET ?? 'change-me-in-vercel-env';
const EMPLOYEE_PASSWORD = process.env.EMPLOYEE_PASSWORD ?? '';

// Base64url エンコード
function b64url(buf: ArrayBuffer | string): string {
  const bytes = typeof buf === 'string'
    ? new TextEncoder().encode(buf)
    : new Uint8Array(buf);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// HMAC-SHA256 JWT 生成
async function createJWT(payload: object): Promise<string> {
  const header  = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body    = b64url(JSON.stringify(payload));
  const signing = `${header}.${body}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signing));
  return `${signing}.${b64url(sig)}`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const origin = new URL(req.url).origin;

  try {
    const form       = await req.formData();
    const employeeId = (form.get('employeeId') as string ?? '').trim();
    const password   = (form.get('password')   as string ?? '');

    if (!employeeId || !password) {
      return Response.redirect(`${origin}/login?error=missing`, 302);
    }

    // 共通パスワードをVercel側で照合（GASにパスワードを渡さない）
    if (!EMPLOYEE_PASSWORD || password !== EMPLOYEE_PASSWORD) {
      return Response.redirect(`${origin}/login?error=invalid`, 302);
    }

    // GASで社員番号の存在確認＋ユーザー情報取得
    const gasRes = await fetch(GAS_URL, {
      method:   'POST',
      redirect: 'follow',
      headers:  { 'Content-Type': 'application/json' },
      body:     JSON.stringify({ action: 'getUser', employeeId }),
    });

    const result = await gasRes.json() as {
      success: boolean;
      message?: string;
      user?: { employeeId: string; name: string; email: string; department: string };
    };

    if (!result.success || !result.user) {
      return Response.redirect(`${origin}/login?error=invalid`, 302);
    }

    // JWT 生成（7日間有効）
    const exp   = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
    const token = await createJWT({
      sub:  result.user.employeeId,
      name: result.user.name,
      dept: result.user.department,
      exp,
    });

    return new Response(null, {
      status: 302,
      headers: {
        'Location':   `${origin}/curriculum`,
        'Set-Cookie': `ai_auth=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`,
      },
    });

  } catch {
    return Response.redirect(`${origin}/login?error=server`, 302);
  }
}
