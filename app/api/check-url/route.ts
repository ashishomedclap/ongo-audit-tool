import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid URL is required' }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    const startTime = Date.now();
    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Sitemap-Auditor/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
        redirect: 'follow'
      });
      clearTimeout(timeoutId);
    } catch (fetchErr: unknown) {
      const latency = Date.now() - startTime;
      const errorMsg = fetchErr instanceof Error ? fetchErr.message : 'Connection failed';
      return NextResponse.json({
        success: true,
        reachable: false,
        url: targetUrl,
        latency,
        error: errorMsg,
        status: 0,
        statusText: 'Unreachable / Timed out'
      });
    }

    const latency = Date.now() - startTime;
    const contentType = response.headers.get('content-type') || 'unknown';
    const server = response.headers.get('server') || 'unknown';
    const contentLength = response.headers.get('content-length') || 'unknown';

    return NextResponse.json({
      success: true,
      reachable: response.ok || response.status < 500,
      url: targetUrl,
      finalUrl: response.url,
      status: response.status,
      statusText: response.statusText,
      latency,
      contentType,
      server,
      contentLength,
      isXml: contentType.includes('xml'),
      isHtml: contentType.includes('html')
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
