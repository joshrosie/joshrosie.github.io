#!/usr/bin/env bash
# Create a new blog post and register it in posts/posts.json.
#
#   ./newpost.sh "My Post Title"              -> publishes to posts/
#   ./newpost.sh -d "Half-baked idea"         -> writes a local draft only
#
# Posts are listed newest-first, in manifest order.
set -euo pipefail

cd "$(dirname "$0")"

draft=0
if [ "${1:-}" = "-d" ] || [ "${1:-}" = "--draft" ]; then
    draft=1
    shift
fi

if [ $# -lt 1 ]; then
    echo "usage: $0 [-d|--draft] \"Post Title\"" >&2
    exit 1
fi

title="$1"
date="$(date +%Y-%m-%d)"

# Title -> slug: lowercase, non-alphanumerics to hyphens, collapse and trim them.
slug="$(printf '%s' "$title" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -E -e 's/[^a-z0-9]+/-/g' -e 's/^-+//' -e 's/-+$//')"

if [ -z "$slug" ]; then
    echo "error: could not build a slug from \"$title\" — use letters or numbers." >&2
    exit 1
fi

if [ "$draft" -eq 1 ]; then
    file="drafts/$slug.md"
else
    file="posts/$slug.md"
fi

if [ -e "$file" ]; then
    echo "error: $file already exists." >&2
    exit 1
fi

printf '# %s\n\n\n' "$title" > "$file"

if [ "$draft" -eq 1 ]; then
    echo "Draft:  $file  (git-ignored — not published)"
    echo "When it's ready: mv \"$file\" posts/ && ./newpost.sh \"$title\""
    exit 0
fi

# Prepend the manifest entry so the newest post sorts first.
python3 - "$slug" "$title" "$date" <<'PY'
import json, sys, pathlib

slug, title, date = sys.argv[1:4]
path = pathlib.Path("posts/posts.json")
posts = json.loads(path.read_text()) if path.exists() else []
posts = [p for p in posts if p.get("slug") != slug]
posts.insert(0, {"slug": slug, "title": title, "date": date, "summary": ""})
path.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n")
PY

echo "Created $file"
echo "Added  posts/posts.json entry (slug: $slug, date: $date)"
echo
echo "Next:  write the post, fill in its one-line \"summary\" in posts/posts.json,"
echo "       then:  git add -A && git commit -m \"Add post: $title\" && git push"
