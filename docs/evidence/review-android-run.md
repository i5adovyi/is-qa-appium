# Android verification after the second review

Captured on 20 October 2026. This is a review-time snapshot.

```text
> is-qa-appium@1.0.0 test:android
> wdio run config/wdio.android.conf.ts


Execution of 3 workers started at 2026-10-20T13:49:44.339Z

[0-0] RUNNING in Android on Android - file:///test/specs/app.forms.spec.ts
[0-0] PASSED in Android on Android - file:///test/specs/app.forms.spec.ts
[0-1] RUNNING in Android on Android - file:///test/specs/app.login.spec.ts
[0-1] 2026-10-20T13:50:44.991Z WARN webdriver: Request encountered a stale element - terminating request
[0-1] 2026-10-20T13:50:45.088Z WARN webdriver: Request encountered a stale element - terminating request
[0-1] PASSED in Android on Android - file:///test/specs/app.login.spec.ts
[0-2] RUNNING in Android on Android - file:///test/specs/app.smoke.spec.ts
[0-2] PASSED in Android on Android - file:///test/specs/app.smoke.spec.ts

 "spec" Reporter:
------------------------------------------------------------------
[wdio-demo.apk Android #0-0] Running: wdio-demo.apk on Android
[wdio-demo.apk Android #0-0] Session ID: 48edabf4-3015-4b26-9e20-2e9cfd855971
[wdio-demo.apk Android #0-0]
[wdio-demo.apk Android #0-0] » test/specs/app.forms.spec.ts
[wdio-demo.apk Android #0-0] Forms screen
[wdio-demo.apk Android #0-0]    ✓ should echo typed text in the result field
[wdio-demo.apk Android #0-0]    ✓ should toggle the switch
[wdio-demo.apk Android #0-0]    ✓ should clear the result when the input is cleared
[wdio-demo.apk Android #0-0]
[wdio-demo.apk Android #0-0] 3 passing (17.5s)
------------------------------------------------------------------
[wdio-demo.apk Android #0-1] Running: wdio-demo.apk on Android
[wdio-demo.apk Android #0-1] Session ID: 6e8e69d5-aa7b-4ef2-bc99-49c0678c9745
[wdio-demo.apk Android #0-1]
[wdio-demo.apk Android #0-1] » test/specs/app.login.spec.ts
[wdio-demo.apk Android #0-1] Login form
[wdio-demo.apk Android #0-1]    ✓ should log in with valid credentials @smoke
[wdio-demo.apk Android #0-1]    ✓ should show validation errors for invalid input
[wdio-demo.apk Android #0-1]    ✓ should show both validation messages when empty fields are submitted
[wdio-demo.apk Android #0-1]
[wdio-demo.apk Android #0-1] 3 passing (39.1s)
------------------------------------------------------------------
[wdio-demo.apk Android #0-2] Running: wdio-demo.apk on Android
[wdio-demo.apk Android #0-2] Session ID: 0bae2815-fa6a-40ab-964c-c81e3fe47d37
[wdio-demo.apk Android #0-2]
[wdio-demo.apk Android #0-2] » test/specs/app.smoke.spec.ts
[wdio-demo.apk Android #0-2] App launch @smoke
[wdio-demo.apk Android #0-2]    ✓ should open the app and show the tab bar
[wdio-demo.apk Android #0-2]
[wdio-demo.apk Android #0-2] 1 passing (3.3s)


Spec Files:	 3 passed, 3 total (100% completed) in 00:01:18
```
