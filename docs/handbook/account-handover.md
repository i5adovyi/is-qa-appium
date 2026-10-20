# Continue on another computer or OpenAI account

The GitHub repository is the portable project. Your local database is the
portable learning record. An OpenAI Site is an optional published reader owned
by the account that created it. These are separate things.

| What you want to keep | Where it lives | How to move it |
|---|---|---|
| Lessons, exercises, framework and saved code edits | Project files and Git history | Commit/push edits, then clone using your GitHub account |
| Local completed lessons and lesson notes | `.local-data/progress.sqlite` by default | `npm run progress:backup`, copy the JSON backup, then `npm run progress:import -- <file>` |
| Hosted-reader completed lessons and notes | Browser storage for that Site address | **Export progress**, then **Import progress** in the destination reader |
| BrowserStack credentials | Local ignored `.env` | Recreate locally from `.env.example`; never put credentials in Git or chat |
| Site identity | Ignored `.sites/<profile>/.openai/hosting.json` | Recover the same Site while signed in to its owner account, or register a separate Site under the new account |
| Chat context | The old conversation | Use this repository's handover prompt; do not assume conversation history transfers |

## Before changing accounts

1. Save editor files. Check `git status`; commit and push learner changes you
   want in the private repository. Uncommitted changes do not arrive on another
   computer automatically.
2. Start the local reader and check its save-status message after editing notes.
   If a save is pending or failed, use **Export progress** before closing the
   page so browser edits are also preserved.
3. Run `npm run progress:backup` from the project terminal. Keep the printed
   JSON backup file somewhere you can access from the new computer. The backup
   contains personal notes; keep it out of Git.
4. If you also study on the hosted Site, export that reader's progress
   separately. It does not write to your desktop database.

On the **same computer**, changing the OpenAI login does not remove the project
folder or its local SQLite database. Reopen the same folder and run
`npm run course`. Different local browser profiles load the same database when
they use the same running local reader.

## Open the project in Codex under the new account

1. Sign in to Codex with the new OpenAI account. Its Codex and Sites availability
   depends on that account; repository access does not enable those services.
2. On the same computer, open/add the existing `is-qa-appium` folder as a local
   project. On a new computer, install Git and Node 24, authenticate with the
   GitHub identity that can access the private repository, then run:

   ```bash
   git clone https://github.com/i5adovyi/is-qa-appium.git
   cd is-qa-appium
   npm ci
   npm run check
   npm run course:test
   ```

3. Open that cloned folder in Codex. No special GitHub link transfers a chat or
   signs you into another account. The source folder is what you open.
4. Paste this prompt into a new chat in that project:

   > Read AGENTS.md, docs/RESUME.md, docs/validation.md and
   > docs/handbook/account-handover.md. This is my mobile automation training
   > project. Inspect its current files and local progress status. Help me
   > continue one practical task at a time. Preserve my starter.ts edits and
   > do not replace exercises with reference answers. Use Node 24. Keep personal
   > progress, the local database and credentials out of commits. Earlier chat
   > history and connected accounts may be unavailable.

5. If moving to another computer, import the copied backup using its actual path:

   ```bash
   npm run progress:import -- "/absolute/path/to/mobile-automation-progress.json"
   npm run progress:status
   npm run course
   ```

   Use the filename printed by the backup command; the filename above is an
   example. On Windows use your Windows file path. Then open
   `http://127.0.0.1:4173`. Import merges completion marks and preserves existing
   database notes when imported text conflicts. It also makes a backup of the
   previous database progress before changing it.

The official [local-project documentation](https://learn.chatgpt.com/docs/projects)
describes opening local source folders. It does not promise transfer of this
conversation, connected-service sessions or access to the old private Site.

## Work as a local desktop project

This is an ordinary Node project you open in Codex or another editor and run on
your computer. It is not a packaged native desktop executable.

```bash
npm run course
```

Keep the server terminal open. Use another terminal for exercises, such as
`npm run practice -- 01`. Stop the reader with Ctrl+C when finished. Starting it
again loads the existing SQLite record. No OpenAI account, API key or Android
installation is needed for lessons and offline coding labs.

The default database is `.local-data/progress.sqlite` inside this checkout.
`COURSE_DATA_DIR` selects another directory when you need to keep data separate
from the source folder. Set it consistently on every start and backup/import
command. For example, on macOS/Linux:

```bash
export COURSE_DATA_DIR="$HOME/mobile-automation-data"
npm run course
```

PowerShell equivalent:

```powershell
$env:COURSE_DATA_DIR = Join-Path $HOME "mobile-automation-data"
npm run course
```

Changing this setting selects another database; it does not move the old one.
Transfer records using backup/import first. Avoid copying a live SQLite file;
the JSON backup commands are the supported transfer route. Keep personal data
outside any directory selected for publishing.

The database stores course completion marks and lesson notes. Exercise code
remains in your files; test results, screenshots and terminal history are not
automatically converted into course completion.

## Create a new private OpenAI Site under the new account

Only do this **after signing in to the intended account**. A Git push or a local
profile name cannot select an OpenAI identity.

Initialize a separate, ignored profile from the project root:

```bash
npm run course:site-profile -- init second-account
```

Then give the new Codex chat this prompt:

> Use the Sites skill and read docs/handbook/hosting.md. I am now signed in to
> the OpenAI account that should own a new private course Site. Use the
> second-account profile at .sites/second-account. Check its manifest first:
> if a Site ID is already recorded, verify that existing Site through the
> native tools and update it; do not create a duplicate. Otherwise register
> one new private Site through the native tool and immediately persist its
> returned ID using the official Sites helper in that profile checkout.
> Open/synchronize the Site source with the official helper before regenerating
> assets. From the main project, run npm run check, npm run course:test and
> npm run course:sites -- --profile second-account. Package and publish the
> prepared profile with the native Sites workflow, preserving private access.
> Do not change the original profile or the main GitHub remote, and never
> include my local database, backups, .env or credentials. Return the actual
> deployed URL. If Sites tools or account access are unavailable, explain the
> missing prerequisite and leave localhost usable.

This registration must happen in the target account. The repository prepares
the source; it does not create an account, transfer the original Site or
authenticate to Sites. See the [hosting guide](hosting.md) for the publishing
contract and existing-Site recovery.

After publication, import an exported progress JSON in the new Site if wanted.
Its notes remain in that browser's storage. There is **no automatic sync**
between Sites, computers or the local SQLite database. Use export/import when
switching; keep backups before merging notes from multiple places.

[Resume prompt](../RESUME.md) · [Fresh-machine setup](../../README.md#setup-on-a-new-machine) ·
[Hosting](hosting.md) · [Course map](../README.md)
