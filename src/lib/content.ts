import { getCollection, type CollectionEntry } from 'astro:content';
import { compareByDateThenId } from './format';

export type Commit = CollectionEntry<'commits'>;
export type Insight = CollectionEntry<'insights'>;

export { formatDate, formatMonthYear } from './format';

/** Fails the build with a clear message if any commit id is duplicated. */
export async function getCommits(): Promise<Commit[]> {
  const commits = await getCollection('commits');
  const seen = new Map<string, string>();
  for (const commit of commits) {
    const id = commit.data.id;
    const existing = seen.get(id);
    if (existing) {
      throw new Error(
        `Content validation failed:\n\n` +
          `content/commits/${commit.id}.md\n` +
          `  id: duplicate value "${id}"\n` +
          `  Already used by content/commits/${existing}.md\n` +
          `  Expected: a unique id across all commits`,
      );
    }
    seen.set(id, commit.id);
  }
  return commits.sort(compareByDateThenId);
}

/** Non-empty, non-whitespace lines in a commit's Markdown body. */
export function commitBodyLineCount(commit: Commit): number {
  const body = (commit.body ?? '').trim();
  if (!body) return 0;
  return body.split('\n').filter((line) => line.trim().length > 0).length;
}

export function commitHasBody(commit: Commit): boolean {
  return commitBodyLineCount(commit) > 0;
}

export async function getInsights(): Promise<Insight[]> {
  const insights = await getCollection('insights');
  return insights.sort(compareByDateThenId);
}
