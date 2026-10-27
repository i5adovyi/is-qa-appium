# BrowserStack source register and integration boundaries

**Reviewed:** 27 October 2026. These are primary references, not copied books
or a promise that future account interfaces/versions remain identical. The
course's exercises and synthetic incidents are original training material.

## Account, execution and devices

- [Signup](https://www.browserstack.com/users/sign_up), [account settings](https://www.browserstack.com/accounts/settings), [App Automate](https://app-automate.browserstack.com/): use your own account; no trial allowance is promised.
- [App Live](https://www.browserstack.com/docs/app-live): manual app testing.
- [WDIO getting started](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio) and [existing suites](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio/integrate-your-tests): provider examples currently name WDIO 7/8/9.
- [App upload API](https://www.browserstack.com/docs/app-automate/api-reference/appium/apps) and [upload lifecycle](https://www.browserstack.com/docs/app-automate/appium/upload-app-from-filesystem): actual upload identifiers and nonpermanent app storage.
- [Device list](https://www.browserstack.com/list-of-browsers-and-platforms/app_automate), [devices API](https://www.browserstack.com/docs/app-automate/api-reference/appium/devices), [plan API](https://www.browserstack.com/docs/app-automate/api-reference/appium/plan): inventory/access/capacity must be checked in the intended account.
- [Remote Appium versions](https://www.browserstack.com/docs/app-automate/appium/set-up-tests/set-appium-version): local dependencies do not lock the cloud server/driver.

## Evidence and reporting

- [Dashboard migration](https://www.browserstack.com/docs/test-reporting-and-analytics/dashboards/optimize-dashboard): old/new navigation and Sessions versus Tests.
- [Name and status executor](https://www.browserstack.com/docs/app-automate/appium/set-name-and-status-of-test): report assertion outcome, not just session lifetime.
- [Debugging options](https://www.browserstack.com/docs/app-automate/appium/set-up-tests/debugging-options), [stability practices](https://www.browserstack.com/docs/app-automate/appium/stability-best-practices), [error codes](https://www.browserstack.com/docs/app-automate/appium/error-codes): evidence availability and investigation.
- [Sessions API](https://www.browserstack.com/docs/app-automate/api-reference/appium/sessions): read-only session/build reporting, with sensitive response fields handled carefully.
- [WDIO JUnit](https://webdriver.io/docs/junit-reporter), [WDIO Allure](https://webdriver.io/docs/allure-reporter): optional reporters, separate from the installed terminal reporter.
- [JUnit 10.1.0 metadata](https://registry.npmjs.org/@wdio%2fjunit-reporter/10.1.0), [Allure reporter 10.1.0 metadata](https://registry.npmjs.org/@wdio%2fallure-reporter/10.1.0), [Allure CLI 3.22.1 metadata](https://registry.npmjs.org/allure/3.22.1), [Allure 3 commands](https://allurereport.org/docs/v3/migrate/): published versions and syntax used in the optional reporting recipe; installation/device execution remains a learner experiment.
- [Analytics WDIO integration](https://www.browserstack.com/docs/test-reporting-and-analytics/getting-started/javascript/webdriverio/integrate-your-tests), [JUnit ingestion](https://www.browserstack.com/docs/test-reporting-and-analytics/references/upload-junit-reports), [build insights](https://www.browserstack.com/docs/test-reporting-and-analytics/features/insights): additional ingestion/compatibility/account requirements.

## Team execution

- [Parallel WDIO execution](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio/parallelize-tests): account limits and runner concurrency are separate.
- [Internal-network testing](https://www.browserstack.com/docs/app-automate/appium/test-on-internal-network), [Local binary options](https://www.browserstack.com/docs/local-testing/binary-params), [connection identifiers](https://www.browserstack.com/docs/app-automate/appium/test-on-internal-network/manage-multiple-connections): optional tunnel lifecycle.
- [Android network security](https://developer.android.com/privacy-and-security/security-config): transport reachability does not establish trust.
- [GitHub secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets) and [workflow artifacts](https://docs.github.com/en/actions/tutorials/store-and-share-data): secret delivery and evidence retention.

## What this repository actually installs

Read `package.json` and the lockfile. The cloud path uses WDIO 10, a direct
checksum-verified APK upload, hub capabilities and a status executor. It does
not install BrowserStack SDK/service, Local, JUnit, Allure, Percy or test-level
analytics ingestion. Provider SDK examples must not overwrite this baseline.

The guide's optional extensions describe deliberate learner experiments;
documentation review, typechecking and mocked tests do not validate them on a
real device. [Validation](../validation.md) records actual evidence. The first
real BrowserStack run remains pending account access unless a later dated
validation entry explicitly records it.

[Path](README.md)
