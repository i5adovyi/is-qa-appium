# Work with this project in VS Code

**The browser is optional.** You can read the course, write tests and run project
commands from the desktop version of Visual Studio Code. Use Markdown preview
for lessons, the editor for code and the integrated terminal for execution.
Node runs offline exercises; Appium and WebdriverIO drive an Android device.
VS Code is where you work with those tools.

| Workflow | What you use |
|---|---|
| VS Code only | Markdown guides beside code, terminal commands, personal notes in files |
| VS Code plus the course reader | The same code and commands, with browser navigation, search, lesson/challenge notes and completion marks |

Both workflows use the same local repository. You do not need to run
`npm run course` for Markdown reading, offline labs or Android tests. The hosted
reader is a reading/progress interface; it does not execute local test files.

## Open the project folder

1. In desktop VS Code, choose **File → Open Folder** and select `is-qa-appium`.
   On the original Mac this is `/Users/igor_sadovyi/Projects/is-qa-appium`.
   On another computer, select your existing clone. Open the whole folder so
   the editor can find the dependencies and configuration.
2. In the Explorer file tree, confirm you can see `package.json`, `docs`,
   `exercises` and `test`.
3. Choose **Terminal → New Terminal**. Run these commands separately:

```bash
node --version
npm run
```

Node must report `v24.…`; `npm run` lists the project's commands. If dependencies
are not installed yet, run `npm ci` in this terminal. For Git/Node installation
or cloning, follow [new-machine setup](../../README.md#setup-on-a-new-machine).
No Markdown, TypeScript or test-runner extension is required for this workflow.

The terminal must stay in the folder containing `package.json`. Opening a nested
file does not change the terminal's directory. VS Code's terminal runs the same
shell commands as a separate terminal application. You can create another with
the **+** button in its terminal panel. [Official terminal walkthrough](https://code.visualstudio.com/docs/terminal/getting-started).

## Read a lesson beside your code

Open [the course map](../README.md) in the Explorer (`docs/README.md`). To display
it as a formatted page:

1. Open the **Command Palette**: **Cmd+Shift+P** on macOS or **Ctrl+Shift+P** on
   Windows/Linux.
2. Run **Markdown: Open Preview to the Side**.
3. Follow the course links to the chosen lesson or exercise instructions.
4. Keep the preview on one side and open the task's code file in the other editor
   group. Click in the code group before opening its file from the Explorer.

For lab 01, preview `exercises/01-typed-data/README.md` and edit
`exercises/01-typed-data/starter.ts` beside it. With the preview active, run
**Markdown: Toggle Preview Locking** if you want it to stay on that document
while opening other Markdown files. These are built-in features; see the
[official Markdown preview guide](https://code.visualstudio.com/docs/languages/markdown#markdown-preview).

You can find a file quickly with **Cmd+P** on macOS or **Ctrl+P** on Windows/Linux:
type its project-relative path, such as `test/specs/app.forms.spec.ts`.
[Official editor navigation](https://code.visualstudio.com/docs/editing/getting-started/userinterface#command-palette).

| File or folder | How to use it |
|---|---|
| `docs/README.md`, `docs/lessons/`, `docs/handbook/` | Read the course and manuals in Markdown preview |
| `exercises/NN-name/README.md` and `starter.ts` | Read a lab contract, then implement or repair your attempt |
| `exercises/NN-name/exercise.test.ts` and `solution.ts` | Inspect acceptance checks; keep the supplied answer separate |
| `test/specs/` | Read or extend the default demo's Android tests as directed by a lesson |
| `test/screens/` and `test/helpers/` | Find screen objects, waits and lifecycle helpers used by those tests |
| `test/training/saucelabs/`, `test/training/apidemos/` | Keep your optional-app specs; `reference/` contains maintainer checks |
| `.local-data/assignments/` | Keep personal offline attempts and evidence; back them up separately |
| `logs/` | Inspect local Appium logs and failure screenshots/XML after a device run |

## Write and run your first offline attempt

Use [lab 01](../../exercises/01-typed-data/README.md) when you understand its
prerequisites. Android is not needed for this section.

1. Read the expected behavior and predict one result.
2. Edit `exercises/01-typed-data/starter.ts` in VS Code. Keep `solution.ts` separate.
3. Save with **Cmd+S** on macOS or **Ctrl+S** on Windows/Linux.
4. In the integrated terminal, run:

```bash
npm run practice -- 01
```

5. Read the first relevant assertion failure and compare expected and actual
   values. Change a small part of your attempt, save and rerun the same command.
6. When it works, explain why. Add a useful case to `exercise.test.ts` if needed,
   preserving its existing checks. The practice runner selects that test file.

Labs 01–10 start unfinished and labs 11–14 have deliberate bugs. A first failure
is expected. Running `npm run practice:solutions` checks the supplied answers;
it does not check your `starter.ts`. For topic assignments such as AS-07, use
the [assignment authoring workflow](../assignments/README.md#make-an-attempt-you-can-keep)
and its Node command. Assignment IDs are not arguments to `practice`.

## Write and run an Android test

First complete [Android setup](setup.md) and obtain the chosen app. VS Code does
not replace Android Studio's SDK/emulator or an Android test device. Start the
device and check `adb devices`. Use a dedicated training device: the configured
Appium session can clear the selected app's data.

For the default demo, download its APK with `npm run app:download`, then run
`npm run preflight` to check setup. Preflight includes the default demo APK;
it does not verify the optional apps. Begin with [lesson 06 Forms](../lessons/06-forms.md).
Read `test/specs/app.forms.spec.ts` beside the lesson, inspect its screen object,
and follow the task's requested changes. For an independent new spec, create a
new file such as `test/specs/learning.forms.spec.ts` only if it does not already
contain your work. Write setup, actions and a meaningful assertion; save it.

Run that specific saved file from VS Code's terminal:

```bash
npm run test:android -- --spec test/specs/learning.forms.spec.ts
```

This example requires you to create and implement that file first. The full
`test:android` command also discovers new `.spec.ts` files in `test/specs/`, so
your additions will join its run. For the supplied examples, choose
`npm run test:smoke`, `npm run test:forms` or `npm run test:login`.

For My Demo App or ApiDemos, follow [the optional-app guide](training-apps.md)
to download and verify the selected APK (`npm run training:apps -- verify saucelabs`
or `npm run training:apps -- verify apidemos`) and copy the unfinished template into a new learner
file without overwriting an attempt. After implementing and saving
`test/training/saucelabs/cart.spec.ts`, for example, run:

```bash
npm run test:training -- saucelabs --spec test/training/saucelabs/cart.spec.ts
```

Use the matching app ID and file path for ApiDemos. Optional specs stay outside
the default demo suite. When several devices are connected, select one using
`ANDROID_UDID` as described in setup. Finish another Appium run or Inspector
session before starting the runner; WebdriverIO starts Appium automatically.

**Use these terminal commands to run specs.** Running a mobile spec directly
with `node`, a generic **Run Code** button or an unconfigured **F5** action does
not create the required WebdriverIO/Appium session. Also, `npm test` is an alias
for the Android smoke test in this project; use `practice` for an offline lab.

## Check types and investigate errors

After installing dependencies, open a `.ts` file, run **TypeScript: Select
TypeScript Version** from the Command Palette, and select the workspace version
to align editor suggestions with the project's installed TypeScript. The
[official TypeScript guide](https://code.visualstudio.com/docs/typescript/typescript-transpiling#using-the-workspace-version-of-typescript)
explains this editor selection. It does not change the Node version in your shell.

Use the relevant project check even if the editor shows no red underlines:

| Command | What it checks |
|---|---|
| `npm run typecheck` | Framework/configuration types, including optional-app specs |
| `npm run typecheck:practice` | Offline lab types using `tsconfig.practice.json` |
| `npm run practice -- 01` | The saved lab 01 attempt's behavior |
| `npm run check` | Project types/docs, supplied lab answers and framework checks; no Android execution |

The root TypeScript configuration includes `test/` and `config/`. Labs use a
separately named configuration selected by the CLI; do not assume editor
diagnostics automatically use it. Personal `.local-data/assignments/` files are
outside both projects; their guide gives an explicit selected-file typecheck.
Executing TypeScript with Node does not typecheck it.

Use **View → Problems** for editor diagnostics and the terminal output for
execution failures. Save the first useful error, the selected command and the
file path. For mobile failures, open the generated PNG/XML files from `logs/`
in VS Code and compare the observed screen with your locator and expectation.
Check artifacts for typed data before sharing them.

| Symptom | First check |
|---|---|
| `package.json` cannot be found | The integrated terminal is in the repository root |
| Old code still runs | The file is saved and the command selects that file in this copy of the project |
| `driver`, `browser` or `describe` is undefined | A mobile spec was started through the correct WebdriverIO command |
| Node/ADB works elsewhere but not in VS Code | Compare the terminal's Node version and SDK environment with [setup](setup.md); open a new terminal after environment changes |
| `npm.ps1` is blocked on Windows | Follow the setup guide's `npm.cmd` alternative |

## Keep notes or add the browser reader

For an editor-only session, create or resume a personal file such as
`.local-data/assignments/AS-13/evidence.md` and record your prediction, command,
result and next action. Saving that file does not update reader completion marks.
Reader progress exports do not include your code or evidence files; back those
up separately. See [local data and backups](local-data.md).

If you prefer the reader's navigation and progress controls, run
`npm run course` in one VS Code terminal and open its printed URL. Keep that
terminal running and use a second terminal for tests. The reader and Markdown
preview display the same course source, but only the reader provides its notes
and completion interface. No test command needs the reader to be running.

**A useful first session:** preview the lab 01 instructions, open its starter
beside them, make one saved attempt and run `npm run practice -- 01`. Record
what the result means before choosing the next task.

[How to use this project](how-to-use.md) · [Course map](../README.md) · [Training apps](training-apps.md)
