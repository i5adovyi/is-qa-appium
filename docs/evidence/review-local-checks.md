# Local checks after the second review

Captured on 20 October 2026. This is a review-time snapshot.

```text
> is-qa-appium@1.0.0 check
> npm run typecheck && npm run typecheck:practice && npm run course:check && npm run practice:solutions && npm run framework:test


> is-qa-appium@1.0.0 typecheck
> tsc --noEmit


> is-qa-appium@1.0.0 typecheck:practice
> tsc -p tsconfig.practice.json


> is-qa-appium@1.0.0 course:check
> node scripts/check-course.mjs

Course check passed: 16 lessons, 48 exercise/solution pairs, 6 offline labs, 54 Markdown files, 214 local links.
This checks repository structure and local links, not external site availability or mobile behaviour.

> is-qa-appium@1.0.0 practice:solutions
> node scripts/practice.mjs --solutions


Checking supplied reference solutions. This does not grade your starter.ts files.

✔ trims surrounding email whitespace (1.13225ms)
✔ preserves password whitespace and email case (0.134834ms)
✔ empty data stays empty rather than inventing defaults (0.105916ms)
✔ each invocation produces an independent object (0.092083ms)
✔ empty fields report both problems (1.223042ms)
✔ seven characters fail and eight pass (0.205292ms)
✔ longer passwords remain valid (0.124042ms)
✔ rejects missing domain, whitespace and multiple at signs (0.128417ms)
✔ reports errors independently (0.101209ms)
✔ counts password whitespace without trimming it (0.101458ms)
✔ waits for each action before starting the next (1.254ms)
✔ propagates the original error and never submits after a failure (0.189333ms)
✔ does not fill when opening fails (0.122625ms)
✔ does not resolve while submission is still pending (2.774208ms)
✔ propagates a submission failure (0.209416ms)
✔ prefers accessibility ID when all clues exist (1.182083ms)
✔ uses resource ID before text and ignores empty accessibility IDs (0.135292ms)
✔ escapes quotes in the fallback text selector (0.124666ms)
✔ fails rather than returning a broad catch-all selector (0.388834ms)
✔ preserves a supplied clue exactly rather than trimming it (0.098084ms)
✔ falls back to text when both identifier clues are empty (0.10275ms)
✔ returns immediately when the first observation matches (1.443167ms)
✔ permits success on the final allowed observation (0.587125ms)
✔ stops at the limit and includes the last actual value (0.363208ms)
✔ rejects invalid limits before calling read (0.260875ms)
✔ does not swallow a broken transport (0.147125ms)
✔ device failures have priority when wrapped in another error (0.930916ms)
✔ connection and lookup evidence get different categories (0.150417ms)
✔ assertion mismatch is distinct from transport failures (0.085375ms)
✔ locator evidence takes priority over a wrapping assertion, regardless of case (0.1955ms)
✔ unknown messages remain unknown (0.133333ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 124.633792

> is-qa-appium@1.0.0 framework:test
> node --test test/unit/*.test.mjs

✔ failure diagnostics preserve evidence without treating skips as failures (3.072292ms)
✔ a complete mocked local environment passes (56.160459ms)
✔ partial dependency installation cannot pass preflight (48.904292ms)
✔ JRE-only and missing build-tools installations produce actionable failures (47.933292ms)
✔ a stale device selection explains how to correct ANDROID_UDID (48.36975ms)
✔ multiple online devices need a selection, which tolerates surrounding whitespace (100.744416ms)
✔ a connected but unbooted device is not ready (48.952375ms)
✔ cloud placeholders fail without values or device commands in output (48.626167ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 461.958625
```
