# Personal website

Static personal site — plain HTML/CSS, no build step, no dependencies.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Homepage — research, projects, background, contact |
| `blog.html` | Writing index (lists posts from `posts/posts.json`) |
| `post.html` | Renders a single post (`post.html?slug=…`) |
| `md.js` | Tiny Markdown → HTML renderer |
| `newpost.sh` | Creates a post and registers it in the manifest |
| `style.css` | All styles |
| `posts/` | Published blog posts (`.md`) + `posts.json` manifest |
| `drafts/` | Local-only drafts (git-ignored, never published) |
| `joshua_rosenthal_cv.pdf` | CV, linked from the homepage |

## Writing a post

```bash
./newpost.sh "Thoughts on Diffusion Samplers"
```

That creates `posts/thoughts-on-diffusion-samplers.md` with the title already in
it, and prepends the matching entry to `posts/posts.json` (newest post first).
Write the post, fill in the one-line `summary` in the manifest, then:

```bash
git add -A && git commit -m "Add post: ..." && git push
```

GitHub Pages redeploys in well under a minute.

For something unfinished, `-d` writes to the git-ignored `drafts/` folder and
touches nothing else:

```bash
./newpost.sh -d "Half-baked idea"
```

When a draft is ready, move it into `posts/` and run `newpost.sh` with the same
title to register it.

### By hand

If you'd rather not use the script: add `posts/my-post.md`, then an entry to
`posts/posts.json`:

```json
{ "slug": "my-post", "title": "My Post", "date": "2026-07-10", "summary": "One line." }
```

`slug` must match the filename and contain only letters, numbers, and hyphens.

## Preview locally

The blog pages use `fetch()`, which needs a server (opening `index.html` via
`file://` won't load posts). From this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Publishing

Live at **https://joshrosie.github.io** — served by GitHub Pages from `main`,
root folder. Pushing to `main` deploys.
