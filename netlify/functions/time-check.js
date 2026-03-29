import { getNyxConfig, getParisParts, isOpenParisWindow } from '../../shared/nyx.js';

export default async function handler(request) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const config = getNyxConfig();
  const paris = getParisParts();

  return Response.json({
    parisDate: `${String(paris.year).padStart(4, '0')}-${String(paris.month).padStart(2, '0')}-${String(paris.day).padStart(2, '0')}`,
    parisTime: `${String(paris.hour).padStart(2, '0')}:${String(paris.minute).padStart(2, '0')}:${String(paris.second).padStart(2, '0')}`,
    window: {
      startHour: config.timeWindowParis.start.hour,
      startMinute: config.timeWindowParis.start.minute,
      endHour: config.timeWindowParis.end.hour,
      endMinute: config.timeWindowParis.end.minute,
      open: isOpenParisWindow(config)
    }
  });
}
