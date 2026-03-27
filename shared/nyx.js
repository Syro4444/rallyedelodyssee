import { createHash } from 'crypto';
import rawConfig from '../config.json' with { type: 'json' };

const DEFAULT_LINES = [
  "Nyx salue votre courage, voyageurs de la nuit, et observe votre progression dans l'ombre.",
  "Les fragments que vous assemblez dissipent peu à peu la pénombre.",
  "Seuls ceux qui persévèrent voient le chemin se révéler devant eux.",
  "Pour accomplir votre quête nocturne, portez immédiatement cet indice à vos dieux."
];

const DEFAULT_SOLUTION = 'Ἀστερία';
const DEFAULT_START = { hour: 1, minute: 15 };
const DEFAULT_END = { hour: 14, minute: 45 };

function intOrFallback(value, fallback) {
  return Number.isInteger(value) ? value : fallback;
}

export function getNyxConfig() {
  const config = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
  const start = config.timeWindowParis?.start || {};
  const end = config.timeWindowParis?.end || {};
  const nyx = config.nyx || {};

  return {
    enableSecretLink: config.enableSecretLink !== false,
    timeWindowParis: {
      start: {
        hour: intOrFallback(start.hour, DEFAULT_START.hour),
        minute: intOrFallback(start.minute, DEFAULT_START.minute)
      },
      end: {
        hour: intOrFallback(end.hour, DEFAULT_END.hour),
        minute: intOrFallback(end.minute, DEFAULT_END.minute)
      }
    },
    nyx: {
      lines: Array.isArray(nyx.lines) && nyx.lines.length > 0 ? nyx.lines.map(String) : DEFAULT_LINES,
      solution: typeof nyx.solution === 'string' && nyx.solution.trim() ? nyx.solution : DEFAULT_SOLUTION
    }
  };
}

export function getParisParts(now = new Date()) {
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const parts = fmt.formatToParts(now);
  const get = (type) => parts.find((part) => part.type === type)?.value || '00';

  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10),
    second: parseInt(get('second'), 10)
  };
}

export function parisDateKey(now = new Date()) {
  const parts = getParisParts(now);
  return `${String(parts.year).padStart(4, '0')}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function isOpenParisWindow(config, now = new Date()) {
  const parts = getParisParts(now);
  const current = parts.hour * 60 + parts.minute;
  const start = config.timeWindowParis.start.hour * 60 + config.timeWindowParis.start.minute;
  const end = config.timeWindowParis.end.hour * 60 + config.timeWindowParis.end.minute;
  return config.enableSecretLink && current >= start && current < end;
}

function headerValue(headers, name) {
  if (!headers) return '';
  if (typeof headers.get === 'function') return headers.get(name) || '';
  const direct = headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
  if (Array.isArray(direct)) return direct[0] || '';
  return direct || '';
}

export function extractClientIp(headers, fallback = '') {
  const candidates = [
    headerValue(headers, 'x-nf-client-connection-ip'),
    headerValue(headers, 'x-forwarded-for'),
    headerValue(headers, 'client-ip'),
    fallback
  ].filter(Boolean);

  const raw = candidates[0] || '';
  return raw.split(',')[0].trim();
}

export function hashIp(ip) {
  const salt = process.env.NYX_IP_SALT || 'change-me-in-netlify-env';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

export function claimStorageKey(dateKey, ipHash) {
  return `claims/${dateKey}/${ipHash}.json`;
}
