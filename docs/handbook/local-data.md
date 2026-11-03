# Local progress, backups and recovery

The local reader saves completed lessons and lesson notes in SQLite, a database
stored on your computer. You do not need to install a database server; Node 24
provides the SQLite support used by this project.

## What is saved where

| Your work | Storage | Transfer or backup |
|---|---|---|
| Local reader's completion marks and lesson notes | `.local-data/progress.sqlite` | `npm run progress:backup`, then `npm run progress:import -- <file>` |
| Changes waiting for a local database save | A separate browser draft for each reader window | Resolve the save status, or export the visible draft |
| Hosted/static reader's completion marks and notes | Browser storage for that address/profile | **Export progress**, then **Import progress** |
| Exercise implementations and learning journal | Files in the project | Save, commit and push, or copy the files separately |
| Test screenshots and logs | Ignored runtime files under `logs/` | Copy deliberately when you need the evidence |

The database does not automatically grade exercises or turn successful tests
into course completion. Mark a lesson complete when you can explain its
checkpoint. There is no automatic cloud sync or shared database between the
local reader and a published Site.

## Everyday use

From your project folder:

```bash
npm run course
```

Open **http://127.0.0.1:4173**. Use the exact address printed by the server;
`localhost` and `127.0.0.1` are different browser origins even when they reach
the same machine.

Edit a lesson note or mark a lesson complete. Wait for **Saved to local
database** before closing the page or stopping the server with Ctrl+C. Start
the same command tomorrow: the reader loads the database again.

The database stays in the project folder after you sign out of OpenAI or use a
different Codex account. Reopen the same folder. A separate clone has a separate
default database, so import a backup if you want to continue there.

Browser profiles reaching the same local server use its database. Existing
open windows can become stale after another window saves; reload when starting
a new study session and resolve any conflict message before continuing.

## Inspect and back up

```bash
npm run progress:status
npm run progress:backup
```

`status` prints the database path, revision and numbers of completed lessons
and notes. It does not print your note contents. `backup` exports the saved
database record and prints the filename, normally under `.local-data/backups/`.
The JSON includes the course's export format so the reader can import it too.

The backup command reads the database, not an unsaved browser draft. Check the
save status first. If a draft cannot save, use **Export progress** in that
window to preserve its current visible record.

Keep personal JSON backups outside Git. Copy important backups outside this
project folder as well: a backup next to the database does not protect against
losing the whole computer or folder.

## Move to another computer

1. On the old computer, save files and wait for database saves to finish.
2. Run `npm run progress:backup` and copy the printed JSON file somewhere you
   can access on the new computer.
3. Copy your exercise changes separately or push them to your own private repository.
4. On the new computer, install Node 24 and Git, clone the repository and run
   `npm ci`. Follow the [new-machine setup](../../README.md#setup-on-a-new-machine).
5. From that project folder, import your copied JSON file:

   ```bash
   npm run progress:import -- "/actual/path/to/your-backup.json"
   npm run progress:status
   npm run course
   ```

Use your actual file path; Windows paths work in PowerShell too. CLI import
creates a backup of the current database record before merging the imported
one. It combines completed lessons and fills missing notes. If both records
have different text for the same lesson, the existing database note wins;
the command reports the conflict count. Keep the source JSON when you need
to copy useful text across manually.

You can instead use **Import progress** in the local reader. That merges into
the visible record and saves it to SQLite when the save succeeds. Export first
if you want an explicit backup of the visible record.

## A note is not saving, or two windows disagree

An older window must not silently overwrite changes saved by a newer one.
The reader checks a database identity and revision when it saves. If another
window has changed the record, your current draft remains available and a
conflict message appears.

1. Read the save-status message. If the server stopped, restart
   `npm run course` and use the offered retry action.
2. For a conflict, choose **Export draft & load saved**. The reader downloads
   the current draft as JSON before loading the database version.
3. Keep that download. Inspect the saved notes, then use **Import progress**
   if you want to merge the exported record deliberately.
4. Import preserves existing conflicting notes. Copy text manually from your
   backup if both versions contain useful information.

The reader keeps interrupted edits in separate durable browser-draft slots for
each window. On a later visit it starts from the database and offers available
drafts in a recovery selector. Select one and choose **Export current & open
draft**; the current visible record is downloaded before that draft is opened.
Opening another window does not automatically replay or take over an
active window's unsaved work. Recovering an old draft can produce a conflict
if the database has moved on; use the export-and-reconcile steps above.
Recovery does not delete another window's draft. Copies identical to the saved
record are hidden; an older copy can appear again after later changes. Its
presence does not mean your latest database save failed. Use its timestamp and
the save-status message to distinguish it from current work.

Drafts depend on that browser's storage. Private browsing, clearing site data,
storage quotas or a lost browser profile can remove them. Saved database data
is independent of browser storage. If storage is unavailable and a save fails,
keep the page open and export its visible progress before leaving.

## Upgrade from the old browser-only reader

The old local reader stored progress only in browser storage. When a fresh
database first meets that browser's old record, the new reader can migrate it
and record that migration. It will not repeatedly replay the old record or
automatically populate a different empty database later.

If progress is absent after changing browser, using a new database directory
or opening another clone, export from the original reader/browser and import
explicitly. Do not delete the database to force migration; that could lose
newer records.

## Put the database outside the project folder

Set `COURSE_DATA_DIR` to a private local directory. On macOS/Linux:

```bash
export COURSE_DATA_DIR="$HOME/mobile-automation-data"
npm run course
```

In PowerShell:

```powershell
$env:COURSE_DATA_DIR = Join-Path $HOME "mobile-automation-data"
npm run course
```

Use the same setting for `progress:status`, `progress:backup` and
`progress:import`. Commands in another terminal do not automatically inherit a
variable you set in this one. Persist the setting in your shell configuration
if you want to use it every day.

Changing the directory selects a different database; it does not move the
original. Back up using the old setting, then import using the new setting.
Choose a private local folder outside `dist/` or `.sites/`; do not place
personal data in a publishing directory.

## If the database cannot open

The reader refuses to reset a corrupt or unsupported database. Keep the
original file for recovery. Check the printed path, folder permissions and
whether you selected the intended `COURSE_DATA_DIR`.

To restore service from a known JSON backup, select a **different empty data
directory**, import the backup there and start the reader with that setting.
For an unsupported newer database, use a compatible reader version instead.
Never delete the only copy to make an error disappear.

Use the JSON commands to transfer a live record. If making a full filesystem
backup, stop the reader first. A plain copy of a database file while it is
being written is not the supported cross-machine transfer route.

## What GitHub and OpenAI Sites receive

`.local-data/`, SQLite files, personal progress backups, `.env` and Site profiles
are ignored by Git and excluded from the static build. Exercise files and
tracked journal text are part of the source, so review those before committing
or publishing.

The static Site has no SQLite connection to your computer. It stores progress
in the visiting browser and supports JSON export/import. A new OpenAI account
needs its own Site registration if it should own a separate hosted reader;
the old private Site and conversation do not transfer through a Git clone.

[Account handover](account-handover.md) · [Hosting](hosting.md) ·
[Resume](../RESUME.md) · [Course map](../README.md)

## Challenge progress and older tabs — 21 October 2026

The real-world challenge path adds CH-01–CH-12 notes and completion marks to the
same progress record as lessons 00–15. The lesson total stays sixteen. Backup,
import and export include both tracks; exercise code and artifacts still require
separate file backups. `progress:status` reports each completion count separately.

Update your checkout before importing a backup containing challenges. An older
checkout only recognizes lesson IDs. The current reader accepts older lesson-only
exports and merges them without erasing challenge evidence.

The hosted reader copies its older browser record to a new v2 storage key once,
keeping the original. Old open tabs write the old key and cannot overwrite new
challenge progress. Close older tabs after exporting any unsaved edits; import
that export into the updated reader to reconcile them. There is no automatic
two-way sync between old and new tabs.

After updating the local project, restart `npm run course` so the server loads
the new catalog, then reload the reader. The updated API rejects pre-challenge
writers with HTTP 426 instead of accepting a record that omits challenge IDs.
If a tab reports a failed save, export its draft before reloading. Database schema
and export schema remain version 1; the browser key and write protocol version
are separate compatibility mechanisms. Do not delete the database to upgrade.
