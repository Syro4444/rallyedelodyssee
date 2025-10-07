export default async (request: Request, context: any) => {
  const res = await context.next();
  if (!isOpenParisWindow(14, 42, 14, 45)) return res;

  const rewriter = new HTMLRewriter().on(".container", {
    element(el) {
      el.append(
        `<a href="/special" class="special" style="display:block;margin:10px 0;padding:12px 18px;border-radius:10px;text-decoration:none;border:1px solid gold;background:gold;color:#111;font-weight:600">✨ Lien spécial</a>`,
        { html: true }
      );
    }
  });
  return rewriter.transform(res);
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
