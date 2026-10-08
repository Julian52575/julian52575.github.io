set shell := ["bash", "-eu", "-c"]
set positional-arguments := true

# List available recipes
default:
    @just --list

#### Dev

# Install dependencies
install:
    npm install

# Start the dev server (http://localhost:4321)
dev:
    npm run dev

# Build the static site into dist/ (fails on invalid content frontmatter)
build:
    npm run build

# Serve the built site locally
preview: build
    npm run preview

# Remove build output and caches
clean:
    rm -rf dist .astro

#### Content

# Scaffold a new timeline commit: `just new-commit my-project`
new-commit id:
    #!/usr/bin/env bash
    set -euo pipefail
    file="src/content/commits/{{id}}.md"
    [ -e "$file" ] && { echo "already exists: $file"; exit 1; }
    cat > "$file" <<EOF
    ---
    id: {{id}}
    title: Title
    description: One-sentence summary shown on the timeline.
    date: "$(date +%Y-%m)"
    tags:
      - name: tag-name
        type: main
    tech_stack:
      - Tool
    ---

    Body goes here.
    EOF
    echo "created $file"

# Scaffold a new insight post: `just new-insight my-post-slug`
new-insight slug:
    #!/usr/bin/env bash
    set -euo pipefail
    file="src/content/insights/{{slug}}.md"
    [ -e "$file" ] && { echo "already exists: $file"; exit 1; }
    cat > "$file" <<EOF
    ---
    title: Title
    date: "$(date +%Y-%m)"
    tags:
      - name: tag-name
        type: main
    ---

    Body goes here.
    EOF
    echo "created $file"
