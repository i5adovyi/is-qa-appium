# Run the course on localhost or OpenAI Sites

The same course reader supports two environments. Lessons, search, worked
answers and progress export/import work in both. Editing TypeScript and running
Appium tests still happen in your cloned project, using a terminal and a device
or BrowserStack. The hosted reader does not run terminal commands.

| Mode | Start/open it | When to use it |
|---|---|---|
| Local reader | `npm run course`, then `http://127.0.0.1:4173` | Read your current files as you edit and practise |
| Static preview | `npm run course:build`, then `npm run course:preview`, then `http://127.0.0.1:4174` | Check the portable build before publishing |
| OpenAI Sites | Open the published link listed in the repository README | Study in a browser without installing Node or Android |

## Localhost

On a new machine, first follow the [README setup guide](../../README.md#setup-on-a-new-machine):
install Git and Node 24, clone the private repository and run `npm ci`.
Then start the reader:

```bash
npm run course
```

Keep the terminal open and visit `http://127.0.0.1:4173`. Use a second terminal
in the same project for exercises and tests. Ctrl+C stops the reader.
No OpenAI account or API key is required for localhost.

## Build and preview the portable site

```bash
npm run course:build
npm run course:preview
```

Visit `http://127.0.0.1:4174`. The build creates an ignored `dist/` directory
containing the reader assets and pre-rendered course content. It does not need
the local `/api` endpoints. Use an HTTP server; opening `index.html` directly
with a `file://` URL is not supported.

If another project uses port 4174, leave it running and choose a free port.
On macOS/Linux, use `COURSE_PORT=48174 npm run course:preview`. In PowerShell,
set `$env:COURSE_PORT = "48174"` before `npm run course:preview`. Open the
address printed by this project's server; a different course at the expected
address means you reached another running project.

Rebuild after editing lessons, source examples or the reader. The builder
selects Git-tracked files from the same library allowlist as the local reader,
then renders their current saved contents. Stage new course files with Git
before building; untracked pages are deliberately excluded.

The exported content includes readable source examples, reference answers and
tracked learning-journal/exercise edits. Review those before publishing.
It excludes `.env`, installed dependencies, APKs, runtime logs, untracked
personal files and browser progress. Build output is reproducible from the
project; generated `dist/` files are not committed to the GitHub repository.

## Publish or update on OpenAI Sites

The registered Site is private to its owner. Its identity is tracked in
`.openai/hosting.json`; this file contains configuration, not an access token.
GitHub access and Site access are separate. A push to GitHub does not deploy
the Site.

Prepare the static Site checkout:

```bash
npm run check
npm run course:test
npm run course:sites
```

`course:sites` builds the course and copies only the generated assets and hosting
manifest to `.sites/mobile-automation-lab/`. That ignored directory is the
separate Site source checkout. It preserves its Git history on later builds.
This command prepares files; it does **not** sign in or publish.

In a chat with the Sites tools available and access to this Site, request:

> Publish the current Mobile Automation Lab to its existing private OpenAI Site.
> Read `.openai/hosting.json` and `docs/handbook/hosting.md`. Check the existing
> Site's access, prepare the static source with `npm run course:sites`, then use
> the Sites source and publishing workflow from `.sites/mobile-automation-lab/`.
> Keep the Site private and keep the GitHub remote unchanged.

The publishing workflow obtains a temporary source credential, synchronizes the
prepared checkout, packages its `dist/` assets, and deploys that exact saved
version. Credentials belong in the tool session, never in this repository or a
shell command. No OpenAI API key is needed by the course itself.

When republishing an existing Site, open/synchronize its source checkout with
the Sites source helper **before** regenerating its files. If `.sites/` is
missing on a new computer, the helper can restore it into an empty directory.
Keep the separate GitHub project as the source of course changes. Reuse the
recorded Site ID; do not register a duplicate to update the existing Site.

The root hosting manifest travels with GitHub. The isolated Site checkout is
generated locally; it contains the static snapshot, not the main repository's
Git history or its private runtime files.

## Changing computer, browser or OpenAI account

Progress and notes stay in browser storage for the origin you are visiting.
Localhost and the hosted Site have separate progress, even in the same browser.
There is no automatic account sync.

1. Click **Export progress** in the reader you have been using.
2. Keep the downloaded `mobile-automation-progress.json`.
3. Open the other reader and click **Import progress**.

Import merges completions and keeps an existing note when imported text
conflicts. Learner code and journal files transfer through Git or a separate
file backup, not through the progress export.

Changing OpenAI accounts does not automatically transfer access to the original
private Site. Continue with localhost and the private GitHub repository using
the GitHub identity that has access. If you need a Site under the new account,
ask for a separate Site registration; the existing manifest identifies the
original Site and must not be treated as authorization for another account.

## What has been verified

Automated checks compare the exported pages with the local renderer, exercise
the static reader data requests over HTTP, and check excluded files and failed
build behavior. These checks do not prove a mobile test passed or establish
browser compatibility on every device. Run `npm run course:test` and
`npm run course:build` after changes.

[New-machine setup](../../README.md#setup-on-a-new-machine) ·
[Resume after switching accounts](../RESUME.md) ·
[Course map](../README.md)
