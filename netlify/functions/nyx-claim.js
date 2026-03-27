import { getStore } from '@netlify/blobs';
import {
  claimStorageKey,
  extractClientIp,
  getNyxConfig,
  getParisParts,
  hashIp,
  isOpenParisWindow,
  parisDateKey
} from '../../shared/nyx.js';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const config = getNyxConfig();
  if (!isOpenParisWindow(config)) {
    return Response.json({ error: 'Unavailable' }, { status: 403 });
  }

  const ip = extractClientIp(request.headers);
  if (!ip) {
    return Response.json({ error: 'Missing client IP' }, { status: 400 });
  }

  const store = getStore('nyx-claims');
  const dateKey = parisDateKey();
  const key = claimStorageKey(dateKey, hashIp(ip));
  const existing = await store.get(key, { type: 'json' });

  if (existing) {
    return Response.json({ error: 'Already used today' }, { status: 409 });
  }

  const paris = getParisParts();
  await store.setJSON(key, {
    usedAtParis: `${String(paris.year).padStart(4, '0')}-${String(paris.month).padStart(2, '0')}-${String(paris.day).padStart(2, '0')} ${String(paris.hour).padStart(2, '0')}:${String(paris.minute).padStart(2, '0')}:${String(paris.second).padStart(2, '0')}`
  });

  return Response.json({
    lines: config.nyx.lines,
    solution: config.nyx.solution
  });
}
