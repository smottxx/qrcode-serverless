# 防本机扫码二维码（Vercel Serverless）

本机扫码会提示「禁止本机扫码」，其他设备扫码可正常跳转。

## 快速使用

### 1. 部署到 Vercel

1. 把整个项目文件夹上传到 GitHub
2. 打开 https://vercel.com 登录
3. 点击 **Add New** → **Project** → 导入仓库
4. Framework Preset 选 **Other**
5. 点击 **Deploy**

部署完成后会得到一个域名，例如：  
`https://qrcode-serverless-xxx.vercel.app`

### 2. 使用方法

1. 用浏览器打开部署后的域名
2. 页面会自动生成一个二维码
3. **本机**用微信/相机扫 → 显示「禁止本机扫码」
4. **其他手机**扫 → 自动跳转到百度（可自行修改跳转地址）

### 3. 修改跳转地址

打开 `api/scan.js`，找到这一行：

```js
Location: 'https://www.baidu.com'
```

改成你想跳转的任意地址即可。

## 本地测试（可选）

```bash
npm i -g vercel
vercel dev
```

然后浏览器打开 http://localhost:3000

## 原理说明

1. 生成页面创建随机 `id`，并存入 Cookie + localStorage
2. 二维码内容指向 `/api/scan?id=xxxxx`
3. 扫码时服务端检查 Cookie：
   - 有相同 id → 本机 → 拦截
   - 没有 → 其他设备 → 放行
