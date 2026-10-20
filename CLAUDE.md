# Claude session entry point — Mobile Automation Lab

Read and follow [AGENTS.md](AGENTS.md) before working in this repository. It is
the shared source of project instructions for every assistant. Read the linked
files themselves; this short entry point does not replace them.

This existing project teaches mobile test automation from beginner foundations
through practical workplace investigations and interviews. Its stack is
Appium, TypeScript, Chai, WebdriverIO/Mocha and BrowserStack, with Android first.
It includes a course, runnable tests, intentionally unfinished/faulty exercises
and a local reader with persistent SQLite progress.

Start with:

1. [README.md](README.md): purpose, setup, commands and architecture.
2. [docs/RESUME.md](docs/RESUME.md): dated state, pending work and session context.
3. [docs/validation.md](docs/validation.md): actual evidence and execution limits.
4. `git status --short` and the files relevant to the user's current request.

For tutoring, choose one task, explain it, let the learner attempt it and review
their evidence. Preserve `starter.ts` work; do not copy in references unless
asked. For maintenance, implement the requested change and run relevant checks.
Use Node 24. Never equate passing reference tests with learner mastery or an
offline check with a successful device session.

Preserve local data and credentials. Do not reset `.local-data/`, replace
another account's Site identity, or assume prior chats/cloud sessions are
available. Detailed storage, publishing and verification rules are in AGENTS.md.

Keep shared rules in AGENTS.md and changing project state in docs/RESUME.md so
future Claude and Codex sessions receive consistent context.
