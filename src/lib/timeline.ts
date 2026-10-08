export interface TagRef {
  name: string;
  type: 'main' | 'sub';
}

export interface CommitSummary {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: TagRef[];
  tech_stack?: string[];
}

export interface InsightSummary {
  id: string;
  title: string;
  date: string;
  tags: TagRef[];
}

export interface TimelineRow {
  commit: CommitSummary;
  kind: 'main' | 'sub';
  /** id of the nearest preceding main commit on this tag, if any (sub rows only) */
  parentId: string | null;
}

/** "2026-08" -> [2026, 8, 1]; "2026-08-30" -> [2026, 8, 30] */
function dateParts(date: string): [number, number, number] {
  const [y, m, d] = date.split('-').map(Number);
  return [y, m, d ?? 1];
}

function compareAsc(a: CommitSummary, b: CommitSummary): number {
  const [ay, am, ad] = dateParts(a.date);
  const [by, bm, bd] = dateParts(b.date);
  if (ay !== by) return ay - by;
  if (am !== bm) return am - bm;
  if (ad !== bd) return ad - bd;
  return a.id.localeCompare(b.id);
}

/**
 * Builds the timeline rows for a given tag: main commits form the spine,
 * sub commits attach to the nearest preceding (chronologically earlier) main commit.
 * Returned newest-first, matching display order.
 */
export function buildTimelineRows(commits: CommitSummary[], tag: string): TimelineRow[] {
  const relevant = commits.filter((c) => c.tags.some((t) => t.name === tag));
  const asc = [...relevant].sort(compareAsc);

  let lastMainId: string | null = null;
  const rows: TimelineRow[] = [];
  for (const commit of asc) {
    const match = commit.tags.find((t) => t.name === tag)!;
    if (match.type === 'main') {
      lastMainId = commit.id;
      rows.push({ commit, kind: 'main', parentId: null });
    } else {
      rows.push({ commit, kind: 'sub', parentId: lastMainId });
    }
  }

  return rows.reverse();
}

export type MergedRow =
  | { type: 'commit'; commit: CommitSummary; kind: 'main' | 'sub'; parentId: string | null }
  | { type: 'insight'; insight: InsightSummary };

function compareDateDesc(aDate: string, aId: string, bDate: string, bId: string): number {
  const [ay, am, ad] = dateParts(aDate);
  const [by, bm, bd] = dateParts(bDate);
  if (ay !== by) return by - ay;
  if (am !== bm) return bm - am;
  if (ad !== bd) return bd - ad;
  return aId.localeCompare(bId);
}

/**
 * Combines commit rows (main/sub graph, as `buildTimelineRows`) with insight
 * rows for the same tag, newest-first. Insights never affect the commit
 * branch structure — they're independent points plotted alongside it.
 */
export function buildMergedRows(
  commits: CommitSummary[],
  insights: InsightSummary[],
  tag: string,
  includeInsights: boolean,
): MergedRow[] {
  const commitRows: MergedRow[] = buildTimelineRows(commits, tag).map((r) => ({
    type: 'commit',
    ...r,
  }));

  if (!includeInsights) return commitRows;

  const insightRows: MergedRow[] = insights
    .filter((i) => i.tags.some((t) => t.name === tag))
    .map((insight) => ({ type: 'insight', insight }));

  return [...commitRows, ...insightRows].sort((a, b) => {
    const aKey = a.type === 'commit' ? a.commit : a.insight;
    const bKey = b.type === 'commit' ? b.commit : b.insight;
    return compareDateDesc(aKey.date, aKey.id, bKey.date, bKey.id);
  });
}

export function allTagNames(commits: CommitSummary[]): string[] {
  const tags = new Set<string>();
  for (const commit of commits) {
    for (const tag of commit.tags) tags.add(tag.name);
  }
  return [...tags].sort();
}

export interface TagOption {
  name: string;
  count: number;
}

/**
 * Tag menu order: "education", "professional" and "personal project" always come
 * first (in that order, when present), then the rest sorted by number of
 * commits descending, ties broken alphabetically.
 */
const PRIORITY_TAGS = ['education', 'professional', 'personal project'];

export function sortTagsForMenu(commits: CommitSummary[]): TagOption[] {
  const counts = new Map<string, number>();
  for (const commit of commits) {
    for (const tag of commit.tags) {
      counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1);
    }
  }

  const priority: TagOption[] = [];
  for (const name of PRIORITY_TAGS) {
    if (counts.has(name)) priority.push({ name, count: counts.get(name)! });
  }

  const rest = [...counts.entries()]
    .filter(([name]) => !PRIORITY_TAGS.includes(name))
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return [...priority, ...rest];
}
