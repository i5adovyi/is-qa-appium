# Android reference run

Captured on 20 October 2026 during course preparation. This is a build-time snapshot.

```text
> is-qa-appium@1.0.0 test:android
> wdio run config/wdio.android.conf.ts


Execution of 3 workers started at 2026-10-20T12:45:51.712Z

[0-0] RUNNING in Android on Android - file:///test/specs/app.forms.spec.ts
[0-0] PASSED in Android on Android - file:///test/specs/app.forms.spec.ts
[0-1] RUNNING in Android on Android - file:///test/specs/app.login.spec.ts
[0-1] PASSED in Android on Android - file:///test/specs/app.login.spec.ts
[0-2] RUNNING in Android on Android - file:///test/specs/app.smoke.spec.ts
[0-2] PASSED in Android on Android - file:///test/specs/app.smoke.spec.ts

 "spec" Reporter:
------------------------------------------------------------------
[wdio-demo.apk Android #0-0] Running: wdio-demo.apk on Android
[wdio-demo.apk Android #0-0] Session ID: 1e38dbfe-4a2e-47bf-b03f-e86b2a34f6e0
[wdio-demo.apk Android #0-0]
[wdio-demo.apk Android #0-0] » test/specs/app.forms.spec.ts
[wdio-demo.apk Android #0-0] Forms screen
[wdio-demo.apk Android #0-0]    ✓ should echo typed text in the result field
[wdio-demo.apk Android #0-0]    ✓ should toggle the switch
[wdio-demo.apk Android #0-0]    ✓ should clear the result when the input is cleared
[wdio-demo.apk Android #0-0]
[wdio-demo.apk Android #0-0] 3 passing (19.8s)
------------------------------------------------------------------
[wdio-demo.apk Android #0-1] Running: wdio-demo.apk on Android
[wdio-demo.apk Android #0-1] Session ID: 4bed7ccf-659c-447c-9308-b1e7a2ce21c1
[wdio-demo.apk Android #0-1]
[wdio-demo.apk Android #0-1] » test/specs/app.login.spec.ts
[wdio-demo.apk Android #0-1] Login form
[wdio-demo.apk Android #0-1]    ✓ should log in with valid credentials @smoke
[wdio-demo.apk Android #0-1]    ✓ should show validation errors for invalid input
[wdio-demo.apk Android #0-1]    ✓ should show both validation messages when empty fields are submitted
[wdio-demo.apk Android #0-1]
[wdio-demo.apk Android #0-1] 3 passing (31.5s)
------------------------------------------------------------------
[wdio-demo.apk Android #0-2] Running: wdio-demo.apk on Android
[wdio-demo.apk Android #0-2] Session ID: 0ee06641-5d98-4a05-b7fa-8fe4dc9b0e82
[wdio-demo.apk Android #0-2]
[wdio-demo.apk Android #0-2] » test/specs/app.smoke.spec.ts
[wdio-demo.apk Android #0-2] App launch @smoke
[wdio-demo.apk Android #0-2]    ✓ should open the app and show the tab bar
[wdio-demo.apk Android #0-2]
[wdio-demo.apk Android #0-2] 1 passing (1m 37.6s)


Spec Files:	 3 passed, 3 total (100% completed) in 00:02:54
```
