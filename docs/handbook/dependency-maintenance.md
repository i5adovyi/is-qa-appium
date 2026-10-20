# Dependency and APK integrity maintenance

## Audited baseline

The 20 October 2026 maintenance pass reduced the project audit from **38 findings
to zero**, including development and optional dependencies. The stack uses
WebdriverIO **10.1.0**, Appium **3.8.0**, and UiAutomator2 **8.7.0**.
Node 24, TypeScript 5 and Chai 5 remain the course baseline.

Run `npm ci` to reproduce the lockfile, then `npm run audit`. CI runs that command
with `--audit-level=low`; newly reported findings fail the job. Zero known npm
advisories at a point in time is not a proof that software has no vulnerabilities.

## Why these dependencies changed

- WebdriverIO 10 replaces vulnerable older browser-download and Mocha dependency
  paths. See its [release notes](https://github.com/webdriverio/webdriverio/releases/tag/v10.1.0).
- The BrowserStack service package depends on WebdriverIO 9 and brings additional
  vulnerable dependencies. This project now uses Node's built-in HTTP and multipart
  support for the documented [app upload API](https://www.browserstack.com/docs/app-automate/api-reference/appium/apps).
  `npm run test:bs` verifies/uploads the APK once, then starts WebdriverIO with the
  returned `bs://` identifier. Its exit status remains the runner's exit status.
  The `after` hook sends the session result using the documented
  [status executor](https://www.browserstack.com/docs/app-automate/appium/set-name-and-status-of-test).
  Upload errors exclude request details and provider response bodies.
- UiAutomator2's published package embeds old dependencies. The project uses an
  unbundled copy with **unchanged driver code** so npm can resolve patched packages.
  The [provenance and reproduction instructions](../../vendor/README.md) include the
  upstream hash, included license and deterministic repack script.

The explicit npm overrides are temporary maintenance constraints:

| Override | Purpose |
|---|---|
| `@appium/base-driver` 10.8.1 | Replace older exact pins that retain vulnerable Axios/Morgan versions |
| `@appium/support` 7.2.8 | Replace older support copies and their vulnerable dependencies |
| `shell-quote` 1.12.0 | Apply the command-quoting security fix |
| `sharp` 0.35.5 | Apply the patched image-library dependency |

`npm run appium:setup` verifies that Appium discovers the installed project driver.
`npm ci` installs it; a separate global driver install is unnecessary. Preflight
rejects a different installation path or version, so the tested driver comes from
the dependency tree that was audited.

Before removing an override, inspect `npm explain <package>` and ensure the normal
resolution is patched. Never use `--force`, omit development dependencies from the
audit, or lower the failure threshold merely to obtain a green result.

## Verified APK downloads

`apps/demo-app.json` pins the demo release URL, byte length and SHA-256 digest.
The digest was obtained from the upstream
[GitHub release asset metadata](https://api.github.com/repos/webdriverio/native-demo-app/releases/assets/379566360)
and matched both the existing APK and a fresh download.

```bash
npm run app:download
npm run app:verify
```

The downloader uses HTTPS, a timeout and a bounded redirect count. It writes to a
temporary directory, rejects oversized/truncated/changed content, and replaces the
destination only after the digest and size match. Failed downloads preserve the
existing APK and clean temporary files. Node 24 handles this on each platform;
curl is no longer required.

Preflight, the local Android configuration and the BrowserStack upload check the
same digest. This verifies the pinned bytes, not an independent APK signing
certificate or a security review of the application.

To adopt a different demo release, deliberately review the upstream release and
its asset digest, update all manifest fields together, download, and run the
mobile suite. Never “fix” a mismatch by copying the unexpected file's hash into the
manifest. There is no skip-verification environment variable.

## Checks after a maintenance change

```bash
npm ci
npm run audit
npm run check
npm run course:test
npm run app:download
npm run app:verify
npm run appium:setup
npm run appium:doctor
npm run preflight
npm run test:android
```

The framework checks cover failed downloads, checksum mismatches, protected
existing files, cloud request/response handling, credential guards and driver
discovery. Mocked cloud checks do not prove a real BrowserStack session works.
Use lesson 12 with an authorized account for that separate verification.

[Validation record](../validation.md) · [Setup](setup.md)
