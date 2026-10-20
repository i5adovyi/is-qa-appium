# Dependency and APK verification evidence

Executed on 20 October 2026 on macOS Apple Silicon, Node 24.22.0 / npm 11.19.1.
This is evidence for the maintenance revision, not a guarantee about future runs.

| Command / check | Observed result |
|---|---|
| Initial `npm audit --json` | 38 findings: 3 moderate, 28 high, 7 critical |
| Clean `npm ci` | Succeeded; reported zero vulnerabilities |
| `npm run audit` and final `npm audit --json` | Zero findings, with development and optional dependencies included |
| `npm ls --all` | Exit 0; no invalid dependency tree |
| `npm run check` | Typechecks and course structure passed; 31 reference exercise tests and 27 framework checks passed |
| `npm run course:test` | 11 checks passed |
| `npm run app:download` | Fresh 123,595,826-byte APK downloaded and verified before replacing the existing file |
| `npm run app:verify` | SHA-256 and size matched the committed manifest |
| `npm run appium:setup` | Appium discovered project-local UiAutomator2 8.7.0 |
| `npm run appium:doctor` | Zero required fixes; bundletool, ffmpeg and GStreamer remain optional/uninstalled |
| `npm run preflight` | Passed, including APK digest, project driver, JDK/SDK and booted device checks |
| `npm run test:android` | 7 tests passed across 3 specs in 1m 13s; no test-level retries |
| Driver repack reproduced twice | Identical SHA-256: `5073c566d0aea23c23ab09ded552e4f561e81ab19543a3c2cd2cb11c80b8dd84` |

The machine-readable final audit is saved beside this page as `dependency-audit.json`.
The lockfile contains no bundled dependency entries. The npm audit output was not
filtered by dependency category or severity.

The verified APK SHA-256 is
`fe1d605ce099c73d93f33e5cbcb0df0bea437ce57aaaaf156b3b0fa1ca54931d`,
matching GitHub's digest for release asset 379566360. The download tests also rejected
same-size corruption, truncation, oversized bodies, HTTP/network/stream failures,
HTTPS downgrades, excess redirects, and aborts while preserving existing files.

BrowserStack checks used mocked HTTP responses and process launch functions.
They checked verified-file upload, multipart contents, credential guards, response
validation, error redaction, argument forwarding, exit status, and session-status
payloads. **No real BrowserStack session was created.**

See [Android output](security-android-run.md),
[maintenance rationale](../handbook/dependency-maintenance.md), and
[validation record](../validation.md).
