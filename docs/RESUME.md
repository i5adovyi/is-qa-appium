# Resume this project after switching accounts

This repository is the portable copy of your mobile automation training project.
Its lessons, exercises, reference code and local reader need **no OpenAI account
or API key**. You can study in an editor and run commands from a terminal.

## Where the project lives

- Private GitHub repository: [i5adovyi/is-qa-appium](https://github.com/i5adovyi/is-qa-appium).
- Existing Mac folder: `/Users/igor_sadovyi/Projects/is-qa-appium`.
- Main entry points: [README](../README.md), [course map](README.md),
  [coverage review](coverage-review.md), [validation record](validation.md).

GitHub access belongs to your GitHub identity. Keep using the GitHub account with
access to this repository even if you change your OpenAI account. On the same Mac,
open the existing folder in a new Codex chat. If it is missing from the sidebar,
add/open that folder again. On another computer, clone it using your GitHub login:

```bash
git clone https://github.com/i5adovyi/is-qa-appium.git
cd is-qa-appium
npm ci
npm run check
npm run course:test
npm run course
```

Install **Node 24** before `npm ci`; `.nvmrc` records the major version. Then open
`http://127.0.0.1:4173` in your browser. On the original Mac, use the existing
checkout instead of cloning over it. Check `git status` before pulling if you
have edited learner exercises.

The [official local-project guidance](https://learn.chatgpt.com/docs/projects)
describes opening folders for local work. It does not establish that this
conversation or connected services transfer between accounts. This guide
deliberately contains the context needed for a fresh chat. The new account's
Codex availability and any connector sign-ins must be checked separately.

## Preserve your own progress

Course notes and completed-lesson marks live in browser storage, not in Git.
Before changing browser profile, account environment or computer:

1. Click **Export progress** at the top of the course reader.
2. Keep the downloaded `mobile-automation-progress.json` in your own backup.
3. Start the reader in the new environment and click **Import progress**.

Import merges completed lessons and keeps an existing note when imported text
conflicts. It does not upload notes. Learner code in `exercises/*/starter.ts` and
edits to `docs/learning-journal.md` are ordinary files: save/commit those changes
separately. GitHub does not receive unsaved editor buffers or browser storage.

The Git repository excludes `.env`, downloaded APKs, `node_modules` and runtime
logs. On this Mac, keep your local `.env`. On another machine, create one from
`.env.example` and enter credentials locally when needed. Do not paste keys into
a chat or commit them. Download the demo APK with `npm run app:download`.

For mobile execution on another machine, follow the [setup manual](handbook/setup.md)
for Android Studio, Java, SDK variables and an emulator. Offline study needs
neither Android nor BrowserStack.

## Current learning and implementation state

As reviewed on **20 October 2026**:

- Stack: Node 24, Appium 3, WebdriverIO 10, TypeScript, Mocha/Chai,
  Android UiAutomator2 and BrowserStack App Automate.
- Course: 16 lessons, 48 lesson exercises, 12 offline coding labs,
  36 workplace scenarios, 48 interview questions, 10 practical drills and
  six staged incident shifts.
- Forms and Login have walkthroughs and reference tests, including clearing
  text and submitting empty login fields.
- Labs 01–10 have unfinished starters; labs 11–12 have deliberate bugs to repair. Use
  `npm run practice -- 01` for your work and `npm run practice:solutions`
  to check the supplied references. Keep these meanings separate.
- Dependency remediation and pinned APK SHA-256/size verification are already
  implemented. Preserve the documented driver packaging and overrides unless
  intentionally updating and validating them.
- Local checks and historical Android execution are recorded in
  [validation](validation.md). Design-only scenarios are not device passes.
- **BrowserStack remains pending:** you still need an account, local credentials
  and an actual real-device session. No successful BrowserStack run is claimed.
- The latest review adds a workplace apprenticeship with staged evidence,
  conflicting requirements and two faulty-code repair labs. Search includes
  all scenarios, questions, drills and shifts. See the coverage review for
  requirements that need another app or backend.

## Prompt for the next chat

Open this project folder first, then paste:

> Read AGENTS.md, docs/RESUME.md, docs/README.md and docs/validation.md in this
> repository. Help me continue learning mobile test automation from beginner
> level using Appium, TypeScript, Chai and BrowserStack. Check my actual files
> and progress rather than assuming earlier chat history is available. Give me
> one practical task at a time, let me attempt it, then explain and review it.
> Do not replace unfinished exercise starters with solutions. BrowserStack
> account setup and the first real Android cloud login smoke run are still
> pending; keep credentials out of chat and Git.

If you only want interview preparation, add your target job description and ask
for a practice session from the existing question bank. Use the dashboard search
to choose a topic, then record evidence in your learning journal.

[Course map](README.md) · [Study plans](handbook/study-plans.md)
