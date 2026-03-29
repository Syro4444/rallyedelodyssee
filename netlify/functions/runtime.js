import fs from 'fs';
import { getStore } from '@netlify/blobs';
import path from 'path';
import {
  claimStorageKey,
  extractClientIp,
  getNyxConfig,
  hashIp,
  isOpenParisWindow,
  parisDateKey
} from '../../shared/nyx.js';

const runtimePath = new URL('../../nyx-client.js', import.meta.url);

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const config = getNyxConfig();
  if (!isOpenParisWindow(config)) {
    return new Response('Not Found', { status: 404 });
  }

  const ip = extractClientIp(request.headers);
  if (!ip) {
    return new Response('Not Found', { status: 404 });
  }

  const store = getStore('nyx-claims');
  const dateKey = parisDateKey();
  const usedToday = Boolean(await store.get(claimStorageKey(dateKey, hashIp(ip)), { type: 'json' }));
  if (usedToday) {
    return new Response('Not Found', { status: 404 });
  }

  const source = fs.readFileSync(runtimePath, 'utf8');
  return new Response(source, {
    status: 200,
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}
