# UiAutomator2 package provenance

`appium-uiautomator2-driver-8.7.0-unbundled.tgz` contains the upstream 8.7.0
driver code, documentation and Apache-2.0 license. Its code is unchanged.
Only bundled `node_modules`, any `npm-shrinkwrap.json`, and the manifest's
`bundleDependencies`/`bundledDependencies` fields are removed.

The registry release embeds vulnerable dependency versions that root npm overrides
cannot replace. Removing that packaging lets this project's lockfile and explicit
overrides resolve the actual runtime dependencies. `npm audit` still examines them;
no dependencies or advisory categories are excluded.

- Source: [npm registry tarball](https://registry.npmjs.org/appium-uiautomator2-driver/-/appium-uiautomator2-driver-8.7.0.tgz)
- Upstream npm integrity: `sha512-5ABLmKeAkE13QkNB2Qd9hTOYl2nfia6ZQ5QNCXefMzlr2HOdsq7T79FZ8Ad2kOydjdI9c1hb6LZ3ctanbUUbOA==`
- Repacked SHA-256: `5073c566d0aea23c23ab09ded552e4f561e81ab19543a3c2cd2cb11c80b8dd84`
- The root `package-lock.json` also records npm's integrity for the local tarball.

To reproduce, from the repository root:

```bash
python3 scripts/repack-uiautomator2.py
git diff --exit-code -- vendor/appium-uiautomator2-driver-8.7.0-unbundled.tgz
```

The script verifies the pinned upstream SHA-512 before reading the archive and
normalizes archive metadata. Python is needed only to reproduce this maintenance
artifact; learners install the committed package with `npm ci`.

Replace this workaround with a registry release once its resolved dependency tree
passes the full audit and Android suite. Do not silently switch back to the bundled
8.7.0 registry package, or edit installed `node_modules` to hide audit findings.
See [dependency maintenance](../docs/handbook/dependency-maintenance.md).
