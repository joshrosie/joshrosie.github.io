# Personal website

Static personal site — plain HTML/CSS, no build step, no dependencies.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage — research, projects, background, contact |
| `blog.html` | Writing index (lists posts from `posts/posts.json`) |
| `post.html` | Renders a single post (`post.html?slug=…`) |
| `md.js` | Tiny Markdown → HTML renderer |
| `style.css` | All styles |
| `posts/` | Published blog posts (`.md`) + `posts.json` manifest |
| `drafts/` | Local-only drafts (git-ignored, never published) |
| `joshua_rosenthal_cv.pdf` | CV, linked from the homepage |

## Writing a post

1. Add a Markdown file: `posts/my-post.md`
2. Add an entry to `posts/posts.json`:
   ```json
   { "slug": "my-post", "title": "My Post", "date": "2026-07-10", "summary": "One line." }
   ```
   (`slug` must match the filename and contain only letters, numbers, and hyphens.)
3. Commit and push.

Keep unfinished work in `drafts/` — it stays on your machine.

## Preview locally

The blog pages use `fetch()`, which needs a server (opening `index.html` via
`file://` won't load posts). From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publish (GitHub Pages)

1. Create a repo and push this folder.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, folder `/ (root)`.
3. Site goes live at `https://<username>.github.io/<repo>/`
   (or your custom domain).
