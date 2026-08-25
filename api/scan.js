// Vercel Serverless Function
// 防本机扫码核心逻辑

export default async function handler(req, res) {
  // 允许跨域（可选）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(400).send(renderPage('参数错误', '缺少 id 参数', '#e74c3c'));
  }

  // 解析 Cookie
  const cookies = parseCookies(req.headers.cookie || '');
  const localId = cookies['anti_scan_id'];

  // ========== 本机扫码拦截 ==========
  if (localId && localId === id) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(403).send(renderPage(
      '禁止本机扫码',
      '请使用其他设备扫描此二维码',
      '#e74c3c'
    ));
  }

  // ========== 其他设备正常处理 ==========
  // 这里示例跳转到百度，你可以改成自己的业务逻辑
  // 例如：跳转到指定页面、返回 JSON、显示内容等
  res.writeHead(302, {
    Location: 'https://www.baidu.com'
  });
  res.end();
}

// 简单 Cookie 解析
function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });
  return list;
}

// 统一渲染提示页面
function renderPage(title, message, color) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f7f8fa;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: white;
      padding: 40px 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      max-width: 360px;
    }
    h2 { color: ${color}; margin: 0 0 12px; font-size: 22px; }
    p { color: #666; margin: 0; font-size: 15px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h2>${title}</h2>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
