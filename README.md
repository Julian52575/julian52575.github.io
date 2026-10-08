# julian52575.github.io

My tech expertise portfolio: who I am, a Git-history-style timeline of projects and
experiences, and technical insights.

Built with [Astro](https://astro.build) + Markdown content collections, deployed to GitHub
Pages.

## Adding content

No application code needs to change to add content.

**A timeline entry (a "commit")**: add a Markdown file to `src/content/commits/`.

```md
---
id: my-project          # unique, used in the URL
title: My Project
description: One-sentence summary shown on the timeline preview.
date: "2026-01"          # "YYYY-MM" or "YYYY-MM-DD", quoted
tags:
  - name: devops
    type: main            # "main" or "sub" — contextual per commit
  - name: education
    type: sub
tech_stack:               # optional
  - Docker
  - Kubernetes
link: https://github.com/you/my-project   # optional, shown in the header (GitHub icon if github.com)
---

Body in Markdown. Omit the body entirely for a bodiless commit: it still shows up on the
timeline (summary only) but gets no article page and isn't clickable.
```

**An insight (blog post)**: add a Markdown file to `src/content/insights/` with `title`,
`date` and `tags` (same rules as above, no `id`/`tech_stack`/`link`).

Both collections are validated at build time (`src/content.config.ts`); the build fails with
a clear error if a file is malformed (missing fields, bad date format, duplicate `id`,
invalid tag `type`, etc).

## Profile placeholders

Edit `src/site.config.ts` to replace name, bio, values and contact links.

## Timeline graph

`/timeline` renders a Git-history-style graph for a selected tag (`?tag=devops`, defaults to
`education`). Commits tagged `main` for that tag form the spine; `sub` commits attach to the
nearest preceding `main` commit. The graph is entirely derived from commit dates and tags —
there are no manually defined parents or branches. See `src/lib/timeline.ts`.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview
```

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
