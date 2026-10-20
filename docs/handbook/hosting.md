# Run the course locally or on OpenAI Sites

Use the local reader while editing exercises and running tests. Publish a static
reader when you want to study in a browser without a development environment.
Both display the same course, but they save personal progress differently.

| Mode | Start/open it | Where progress is saved |
|---|---|---|
| Local desktop project | `npm run course`, then `http://127.0.0.1:4173` | Local SQLite database; persists after stopping the server |
| Static preview | `npm run course:build`, then `npm run course:preview`, then `http://127.0.0.1:4174` | Browser storage for the preview address |
| OpenAI Site | Open the URL returned by successful publication | Browser storage for that Site address |

The hosted reader cannot run TypeScript exercises or Appium commands. Those run
from your cloned project with the appropriate terminal, emulator or BrowserStack
account. Hosting does not turn the course into a cloud test runner.

## Localhost and durable progress

Follow the [new-machine setup](../../README.md#setup-on-a-new-machine), then:

```bash
npm run course
```

Keep the terminal open and visit `http://127.0.0.1:4173`. Use a second terminal in
the same project for exercises. Ctrl+C stops the reader. No OpenAI account or
API key is required.

Completed lessons and lesson notes are saved in `.local-data/progress.sqlite`.
The folder is ignored by Git and excluded from the static site. Reopening the
same project loads the same database, including after an OpenAI account change.
The reader reports whether saves are pending, successful or failed; export
progress before closing if a save cannot complete.

```bash
npm run progress:status
npm run progress:backup
```

The backup command prints a JSON filename. Copy that file to another machine,
then use `npm run progress:import -- "/path/to/backup.json"`. Import merges
completion marks and keeps existing database notes when imported text conflicts.
An existing database is backed up before the import changes it.

`COURSE_DATA_DIR` selects a different data directory. Use the same setting for
the reader and backup commands. Switching the path does not move existing data;
use backup/import. See [account and computer handover](account-handover.md) for
examples and recovery instructions.

Older versions kept all local progress in the browser. On first use with an
empty database, the reader can migrate that browser's existing record once and
mark it migrated. Neither an already-used database nor a later empty database
is silently populated from that old browser copy. Export/import explicitly when
combining progress. Interrupted edits have separate per-window draft slots and
are offered for explicit recovery; a new window starts from the database.
Exercise code and journal files are ordinary project files, not database
records. See [local data and recovery](local-data.md).

## Build and preview the portable site

```bash
npm run course:build
npm run course:preview
```

Visit `http://127.0.0.1:4174`. The ignored `dist/` directory contains reader
assets and pre-rendered course content. This version uses browser storage and
does not need local `/api` endpoints. Use an HTTP server; opening `index.html`
directly through `file://` is not supported.

For a different preview port, use `COURSE_PORT=48174 npm run course:preview` on
macOS/Linux, or set `$env:COURSE_PORT = "48174"` first in PowerShell. Use the
address printed by this server.

Rebuild after changing lessons, examples or reader code. The builder selects
Git-tracked files from the reader's allowlist, then renders their saved contents.
Stage new course pages before building; untracked pages are excluded.

The export includes readable source examples, reference answers and tracked
learning-journal/exercise edits. Review those before publication. It excludes
`.env`, dependencies, APKs, runtime logs, SQLite data, personal progress backups,
Site profiles and untracked personal files. Generated `dist/` files do not
belong in the main GitHub repository.

## Separate Site profiles for separate accounts

The tracked root `.openai/hosting.json` contains only the reusable static
configuration. **It does not identify or authorize a Site.** A registered
identity belongs in the ignored profile checkout:

```text
.sites/
  mobile-automation-lab/       # original account's existing Site, if present
    .openai/hosting.json
    .git/
    dist/
  second-account/              # independent Site owned by another account
    .openai/hosting.json
    .git/
    dist/
```

Initialize and inspect a new profile from the project root:

```bash
npm run course:site-profile -- init second-account
npm run course:site-profile -- status second-account
```

`init` creates a static manifest with no `project_id`. It neither signs in nor
registers a Site. Use lowercase letters, digits and single hyphens for names,
starting with a letter. A profile name is a local label, not an account login.

Registration returns a real Site ID. The Sites workflow must immediately persist
it with the official `set-project-id.mjs` helper in the selected profile. This
project also provides an idempotent binding/recovery command:

```text
npm run course:site-profile -- bind second-account <actual-returned-project-id>
```

Replace the placeholder with the exact ID returned by the native tool; never
invent one. Binding records an ID but does not prove account access. The command
refuses to replace a different existing identity. Create another profile when
you intend to create a different Site.

## Publish a new Site in the intended OpenAI account

The operator must be signed in to the account that should own the Site, with
native Sites tools available. Use the copyable [new-account handover prompt](account-handover.md#create-a-new-private-openai-site-under-the-new-account)
to ask Codex to perform the following workflow:

1. Read the installed Sites skill. Initialize the named profile if needed and
   inspect its manifest. If it already has an ID, follow the existing-Site
   workflow below.
2. Call native `create_site` once to register a new private Site. Immediately
   run the official `set-project-id.mjs --project-id <returned-id>` helper from
   the profile directory. Resolve an uncertain registration result before
   retrying; do not create duplicates.
3. Use that Site's source credential with the official `site-workflow.mjs`
   helper to open/synchronize the profile checkout. Keep the credential in
   session memory and pass it through the helper's stdin, never a command-line
   argument or repository file. Use the returned checkout path.
4. From the main GitHub project root, validate and regenerate the selected
   source:

   ```bash
   npm run check
   npm run course:test
   npm run course:sites -- --profile second-account
   ```

   Preparation requires a recorded Site ID. It copies only generated `dist/`
   content, preserving the profile manifest and Site source Git history.
   The command does not publish.
5. Use the official source helper to synchronize and package that prepared
   checkout. Pass its verified Site ID, commit SHA and archive directly to the
   native publishing tools. Preserve owner-private access. Report the actual
   deployed URL only after successful publication.

The helper paths come from the installed Sites skill; they are not files in
this training repository. Sites availability and access must be verified in
the actual target account. If unavailable, the local reader remains fully
usable; there is no substitute API key or automatic account transfer.

## Update or recover an existing Site

For the original account's existing profile, use:

```bash
npm run course:site-profile -- status mobile-automation-lab
```

While signed in to its owning account, use native `get_site` to verify its ID
and audience, then obtain a source write credential. Open/synchronize its source
with the official helper **before** regenerating the static files. Then run:

```bash
npm run course:sites -- --profile mobile-automation-lab
```

Package and publish that checkout using the existing identity and audience.
Do not call `create_site` to update an already registered Site.

On another computer, ignored profiles are absent. Find the existing Site
through the native tools/account interface and use the official source helper
to restore its source into an empty profile directory. Verify the restored
manifest before preparing it. Do not copy the original Site ID into a different
account's new profile and assume it grants access.

GitHub and Sites use separate source repositories. Keep the main repository's
GitHub remote unchanged. A Git push does not deploy the Site. Official
[publishing and sharing guidance](https://learn.chatgpt.com/docs/sites/publishing-and-sharing)
describes Site access; repository membership does not grant private Site access.

## Move progress between environments

There is **no automatic cloud sync**. The local database and each static
reader's browser storage are separate:

1. In the reader you have been using, click **Export progress**.
2. Keep the downloaded JSON in your personal backup.
3. In the destination reader, click **Import progress**.

On localhost, imported records are saved to SQLite. On a hosted or static
reader, they remain in that browser's storage. Import merges completions and
keeps an existing note when imported text conflicts. Back up first if you need
to reconcile different notes manually. Clearing browser storage removes the
hosted reader's local progress unless you exported it.

## Verification limits

Automated checks cover SQLite persistence/recovery, progress transfers, profile
identity isolation, static output and excluded files. A passing check does not
authenticate another OpenAI account, publish a Site or establish a mobile/cloud
test pass. Those actions need their own observed results.

[New-machine setup](../../README.md#setup-on-a-new-machine) ·
[Account handover](account-handover.md) · [Resume](../RESUME.md) · [Course map](../README.md)
