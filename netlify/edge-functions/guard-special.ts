export default async (_request: Request, context: any) => {
  if (isOpenParisWindow(14, 42, 14, 45)) return context.next();
  return Response.redirect(new URL("/", context.request.url), 302);
};

function isOpenParisWindow(hStart: number, mStart: number, hEnd: number, mEnd: number): boolean {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit"
  });
  const parts = fmt.formatToParts(now);
  const h = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
  const m = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);

  const cur = h * 60 + m;
  const start = hStart * 60 + mStart;
  const end = hEnd * 60 + mEnd;
  return cur >= start && cur < end;
}
