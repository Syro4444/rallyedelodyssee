import { getStore } from '@netlify/blobs';
import {
  claimStorageKey,
  extractClientIp,
  getNyxConfig,
  hashIp,
  isOpenParisWindow,
  parisDateKey
} from '../../shared/nyx.js';

export default async function handler(request) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const config = getNyxConfig();
  const windowOpen = isOpenParisWindow(config);
  if (!windowOpen) {
    return Response.json({ showEye: false, windowOpen: false, usedToday: false });
  }

  const ip = extractClientIp(request.headers);
  if (!ip) {
    return Response.json({ showEye: false, windowOpen: true, usedToday: true, reason: 'missing-ip' }, { status: 400 });
  }

  const store = getStore('nyx-claims');
  const dateKey = parisDateKey();
  const usedToday = Boolean(await store.get(claimStorageKey(dateKey, hashIp(ip)), { type: 'json' }));

  return Response.json({
    showEye: !usedToday,
    windowOpen: true,
    usedToday
  });
}
