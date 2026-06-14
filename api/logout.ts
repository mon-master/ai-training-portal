export const config = { runtime: 'edge' };

export default function handler(req: Request): Response {
  const origin = new URL(req.url).origin;
  return new Response(null, {
    status: 302,
    headers: {
      'Location':   `${origin}/login`,
      'Set-Cookie': 'ai_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
