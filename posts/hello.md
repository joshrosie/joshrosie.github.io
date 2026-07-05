# Hello

This is a small space for writing — notes on research, things I'm building, and
whatever I'm thinking about.

## How this works

Posts are plain Markdown files in the `posts/` folder. To publish a new one:

1. Write a `.md` file, e.g. `posts/my-idea.md`.
2. Add an entry to `posts/posts.json` with its `slug`, `title`, `date`, and a short `summary`.
3. Commit and push.

Anything I *don't* add to `posts.json` — or keep in the local `drafts/` folder —
stays on my machine and never gets published.

You can use **bold**, *italic*, `inline code`, [links](https://github.com/joshrosie),
lists, and code blocks:

```python
def hello():
    print("hi")
```

> That's it. Simple on purpose.
