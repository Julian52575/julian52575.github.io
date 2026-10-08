/** "2026-08" -> [2026, 8, 1]; "2026-08-30" -> [2026, 8, 30] */
export function dateParts(date: string): [number, number, number] {
  const [y, m, d] = date.split('-').map(Number);
  return [y, m, d ?? 1];
}

export function compareByDateThenId(
  a: { data: { date: string }; id: string },
  b: { data: { date: string }; id: string },
) {
  const [ay, am, ad] = dateParts(a.data.date);
  const [by, bm, bd] = dateParts(b.data.date);
  if (ay !== by) return by - ay;
  if (am !== bm) return bm - am;
  if (ad !== bd) return bd - ad;
  return a.id.localeCompare(b.id);
}

export function formatDate(date: string): string {
  const [y, m, d] = dateParts(date);
  const label = new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  return date.length > 7 ? `${label} ${d}, ${y}` : `${label} ${y}`;
}

/** "2026-08-30" -> "August 2026" */
export function formatMonthYear(date: string): string {
  const [y, m] = dateParts(date);
  const label = new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-US', {
    month: 'long',
    timeZone: 'UTC',
  });
  return `${label} ${y}`;
}
