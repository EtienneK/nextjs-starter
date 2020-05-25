import nextConnect from 'next-connect';
import { createProxyMiddleware } from 'http-proxy-middleware';

const handler = nextConnect();

handler.get(
  createProxyMiddleware({
    target: 'https://httpbin.org/headers',
    changeOrigin: true,
    pathRewrite: { '^/api/proxy-example': '' },
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader('authorization', 'Bearer some_backend_token');
      proxyReq.removeHeader('cookie');
    },
  }) as any,
);

export default handler;
