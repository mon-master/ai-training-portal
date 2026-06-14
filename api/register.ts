export const config = { runtime: 'edge' };

const GAS_URL = process.env.GAS_URL!;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const origin = new URL(req.url).origin;

  try {
    const form           = await req.formData();
    const name           = (form.get('name')            as string ?? '').trim();
    const employeeId     = (form.get('employeeId')      as string ?? '').trim();
    const department     = (form.get('department')      as string ?? '').trim();
    const email          = (form.get('email')           as string ?? '').trim();
    const password       = (form.get('password')        as string ?? '');
    const passwordConfirm = (form.get('passwordConfirm') as string ?? '');

    // バリデーション
    if (!name || !employeeId || !department || !email || !password) {
      return Response.redirect(`${origin}/?error=missing`, 302);
    }
    if (password !== passwordConfirm) {
      return Response.redirect(`${origin}/?error=password_mismatch`, 302);
    }
    if (password.length < 8) {
      return Response.redirect(`${origin}/?error=password_short`, 302);
    }

    // GASに登録依頼
    const gasRes = await fetch(GAS_URL, {
      method:   'POST',
      redirect: 'follow',
      headers:  { 'Content-Type': 'application/json' },
      body:     JSON.stringify({ action: 'register', name, employeeId, department, email, password }),
    });

    const result = await gasRes.json() as { success: boolean; message: string };

    if (!result.success) {
      const code = result.message.includes('すでに登録') ? 'duplicate' : 'server';
      return Response.redirect(`${origin}/?error=${code}`, 302);
    }

    return Response.redirect(`${origin}/login?registered=1`, 302);

  } catch {
    return Response.redirect(`${origin}/?error=server`, 302);
  }
}
