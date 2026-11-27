import { build } from 'vite';
import { resolve } from 'node:path';

process.env.VITE_WARUREU_ONLINE_URL ??= '/api/warureu/v1';
await build();
await build({
  configFile:false,
  build:{
    ssr:resolve('../server/online/start.ts'), target:'node22', outDir:'online-dist',
    rollupOptions:{output:{entryFileNames:'server.mjs'}},
  },
});
