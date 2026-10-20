# Local check results

Captured on 20 October 2026 during course preparation. This is a build-time snapshot.

```text
> is-qa-appium@1.0.0 check
> npm run typecheck && npm run typecheck:practice && npm run course:check && npm run practice:solutions


> is-qa-appium@1.0.0 typecheck
> tsc --noEmit


> is-qa-appium@1.0.0 typecheck:practice
> tsc -p tsconfig.practice.json


> is-qa-appium@1.0.0 course:check
> node scripts/check-course.mjs

Course check passed: 16 lessons, 48 exercise/solution pairs, 6 offline labs, 51 Markdown files, 197 local links.
This checks repository structure and local links, not external site availability or mobile behaviour.

> is-qa-appium@1.0.0 practice:solutions
> node scripts/practice.mjs --solutions

✔ trims surrounding email whitespace (0.560458ms)
✔ preserves password whitespace and email case (0.064542ms)
✔ empty data stays empty rather than inventing defaults (0.058333ms)
✔ each invocation produces an independent object (0.045292ms)
✔ empty fields report both problems (0.610125ms)
✔ seven characters fail and eight pass (0.097458ms)
✔ longer passwords remain valid (0.05875ms)
✔ rejects missing domain, whitespace and multiple at signs (0.060167ms)
✔ reports errors independently (0.050542ms)
✔ waits for each action before starting the next (0.538084ms)
✔ propagates the original error and never submits after a failure (0.096958ms)
✔ does not fill when opening fails (0.062042ms)
✔ does not resolve while submission is still pending (1.070625ms)
✔ propagates a submission failure (0.095917ms)
✔ prefers accessibility ID when all clues exist (0.552875ms)
✔ uses resource ID before text and ignores empty accessibility IDs (0.067625ms)
✔ escapes quotes in the fallback text selector (0.063041ms)
✔ fails rather than returning a broad catch-all selector (0.187542ms)
✔ returns immediately when the first observation matches (0.450125ms)
✔ permits success on the final allowed observation (0.299083ms)
✔ stops at the limit and includes the last actual value (0.17625ms)
✔ rejects invalid limits before calling read (0.11ms)
✔ does not swallow a broken transport (0.062084ms)
✔ device failures have priority when wrapped in another error (0.406416ms)
✔ connection and lookup evidence get different categories (0.065375ms)
✔ assertion mismatch is distinct from transport failures (0.041208ms)
✔ unknown messages remain unknown (0.047167ms)
ℹ tests 27
ℹ suites 0
ℹ pass 27
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 75.002792
```
