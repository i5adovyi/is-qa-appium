# Computer, editor and terminal basics

**Prerequisites:** access to a computer; no programming knowledge assumed.
**Goal:** know where to type, where files are saved and what actually runs.
**Limits:** B1 can be read before installing anything. B2–B3 require Node 24,
the cloned project and installed dependencies. No emulator or cloud account.

For a step-by-step layout with lesson preview, code and terminal in one window,
use [the VS Code walkthrough](vscode.md). The browser reader is optional.

## Three places with three jobs

| Place | What you do there | What it does not do |
|---|---|---|
| Editor, such as VS Code or Codex's file editor | Open a project folder, create/edit files, save text | Reading a file does not execute it |
| Terminal | Type commands such as `npm run course`, then press Enter | It is not the browser address bar |
| Browser | Visit the reader, read lessons, keep progress notes | Pasting TypeScript into a note does not run a test |

An editor's integrated terminal is a terminal inside its window. A standalone
Terminal app or PowerShell works too. Choose one terminal at first. The **shell**
interprets commands: usually zsh on this Mac, bash on many Linux systems or
PowerShell on Windows. Node executes JavaScript/our supported TypeScript files;
npm runs named project commands and installs packages.

Use your editor's **Open Folder** action to select `is-qa-appium`, then its
**New File** action when a lesson names a practice file. Expand folders in the
file tree to find existing files. Open the editor's **Terminal** panel for
commands. If using a separate terminal, navigate to the same project root.

In a hosted reader, the Copy button copies text to your clipboard. Paste a shell
command into your local terminal, or source code into the file explicitly named
in the lesson. Copying and pasting do not install the local project.

## Paths and the current folder

The **project root** is `is-qa-appium`, the folder containing `package.json`.
The **current folder** is where the terminal resolves relative paths. Selecting
a file in the editor does not necessarily change the terminal's current folder.

| Task | macOS/Linux shell | Windows PowerShell |
|---|---|---|
| Show current folder | `pwd` | `Get-Location` |
| List visible files | `ls` | `Get-ChildItem` |
| Move into a child folder | `cd is-qa-appium` | `Set-Location is-qa-appium` |
| Move to its parent | `cd ..` | `Set-Location ..` |
| Read the script names | `npm run` | `npm run` |

`test/screens/FormsScreen.ts` means start at the root, open `test`, then
`screens`, then that file. `..` means parent folder; `.` means current folder.
An absolute path starts from the filesystem root/drive, for example
`/Users/your-name/Projects/is-qa-appium` or `C:\Users\your-name\Projects\is-qa-appium`.
Those are examples: use your real path. Quote paths containing spaces.
`~` in the Mac/Linux commands means your home folder, not the repository root.

Names and capitalization matter. `FormsScreen.ts` and `formsscreen.ts` can be
different files, especially on Linux CI. A file accidentally saved as
`learning-terminal.ts.txt` is not the intended `.ts` file. Check its full name
in your editor. Do not edit installed files in `node_modules/`.

### B1 · Find the right folder

**Task:** open the project folder in your editor. In its terminal, show the
current path, list the files and find `package.json`. Run `npm run` if Node is
installed. Explain why running it in a parent folder can fail.

**Acceptance:** you can point to the same `package.json` in the file tree and
terminal. `npm run` lists scripts including `course`; it does not run them all.

<details><summary>Hint / review</summary>

If the file list contains another `is-qa-appium` folder, you may be one level
too high. Enter that folder. If Node is missing, complete steps 1–4 of the
new-machine guide and return here; do not claim the command ran.
</details>

## Read commands before pasting

`npm run practice -- 01` has four parts: `npm` is the tool, `run practice`
selects the `practice` script from `package.json`, `--` passes the following
argument to that script, and `01` chooses lab 01. It is not lesson 01.

- Code fences marked `bash` or `powershell` contain terminal commands.
- Fences marked `ts` contain TypeScript for the named file. Do not include the
  surrounding three backticks when copying manually.
- Fences marked `text` usually show sample output; do not run the output.
- A shell prompt such as `%`, `$` or `PS C:\…>` is not part of a command.
- Placeholders such as `/path/to/backup.json` must be replaced with your path.
- `&&` chains commands only after success in supporting shells. Run commands
  separately while learning; older Windows PowerShell does not support it.

The editor's **Save** action writes changes to disk: commonly Cmd+S on Mac or
Ctrl+S on Windows/Linux. Commands read saved contents. A browser refresh cannot
save your source file. Use straight code quotes (`'` or `"`), not curly quotes
copied from a word processor.

### B2 · Prove you edited the file that runs

**Task:** create a new `test/learning-terminal.ts` in the editor. If that file
already contains your work, choose another `test/learning-*.ts` name and adjust
the command. Paste, save, and run:

```ts
export {}
console.log('I ran my saved file')
```

```bash
node test/learning-terminal.ts
```

Change only the message to `I changed one line`, save, and run again.
`export {}` marks the file as its own module, keeping practice names separate.

**Acceptance:** the second run prints the changed message. Explain why an old
message suggests an unsaved edit, wrong path or different copy of the file.

<details><summary>Hint / review</summary>

Check the file's full path and save indicator before editing it again. This
`.ts` file is a local program, not a mobile `.spec.ts`. Do not run a real mobile
spec directly with `node`; those need WebdriverIO and a session.
</details>

## A running server is supposed to stay running

`npm run course` starts the reader and keeps that terminal busy. After it prints
the local URL, open the URL in a browser. The absence of a new shell prompt is
normal. Use a **second terminal in the same root folder** for exercise commands.

Ctrl+C in the server's terminal stops that server. The saved SQLite progress
stays on disk. Repeating `npm run course` reopens it. `localhost`/`127.0.0.1`
means this computer; port `4173` identifies the reader service on it. A phone's
`localhost` points to the phone, not your laptop. Internet access alone cannot
start a stopped local server.

### B3 · Stop, restart and keep your work

**Task:** start the reader if it is not already running. Note its printed URL.
Open a second terminal and run `node --version` there. Wait for any reader edits
to save, then use Ctrl+C in the terminal **you started**, and start it again.

**Acceptance:** the reader loads after restarting; Node reports `v24.…` in the
second terminal. You can explain which process you stopped. Do not terminate
an unfamiliar service just because a port is busy.

<details><summary>Hint / review</summary>

An `EADDRINUSE` message often means a reader is already running. Check its URL
and the terminal that owns it. See the hosting guide for a different port.
No progress reset or repeated dependency installation is needed to restart.
</details>

## Read the first useful error

| Observation | First small check |
|---|---|
| `command not found: node` / `node is not recognized` | Check Node installation and reopen the terminal; see new-machine setup |
| `ENOENT` mentioning `package.json` | Show current folder; find the actual project root |
| Cannot find the file you asked Node to run | Check the path, capitalization, extension and whether you saved it |
| Cannot find package `chai` | At the root, verify dependencies were installed with `npm ci` |
| TypeScript prints a file, line and `TS…` code | Read that location; do not reinstall Android to fix a language error |
| `Exercise 01: implement makeCredentials` | You reached the unfinished lab; use the first-lab coach |
| The browser cannot connect to localhost | Check the reader process and exact printed port |

`npm ci` is an installation step, not part of every study session. Do not use
`sudo`, global installs, deletion commands or `npm audit fix --force` as a
general response to an unfamiliar message.

## Saving a file, committing and backing up differ

Saving changes a file on this computer. A Git **commit** records selected saved
changes locally. A **push** sends commits to the remote repository. Git does not
save editor buffers or the ignored progress database. Read `git status --short`
and `git diff` to inspect changes; an untracked new file needs separate review.
Those commands inspect work, they do not delete it.

For now, keep your practice files and use the reader's progress export or
`npm run progress:backup` for saved database notes. Before sharing or publishing
tracked practice/journal files, remove personal data; static exports can include
tracked learning files. Ask for help reviewing specific files before your first
commit. Avoid reset/clean commands while learning.

[Next: programming](programming-first-steps.md) · [Setup](../../README.md#setup-on-a-new-machine) · [Local data](local-data.md)
