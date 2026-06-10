// トップページ以外にBasic認証をかける
export const config = {
  matcher: ['/((?!$|_astro|favicon|apple-touch).*)'],
};

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // トップページ（/）と静的アセットは認証不要
  if (url.pathname === '/' || url.pathname.startsWith('/_astro/') || url.pathname.startsWith('/favicon')) {
    return;
  }

  const authHeader = request.headers.get('Authorization');
  const password = process.env.SITE_PASSWORD ?? 'smrlab';

  if (authHeader && authHeader.startsWith('Basic ')) {
    const credentials = atob(authHeader.slice(6));
    const [, pwd] = credentials.split(':');
    if (pwd === password) {
      return;
    }
  }

  return new Response('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="AI研修ポータル"',
    },
  });
}
