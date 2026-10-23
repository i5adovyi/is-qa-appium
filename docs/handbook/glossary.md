# Mobile automation glossary

Use [Testing foundations](testing-foundations.md) to practise these terms in
team conversations. Describe the real boundary as well as its label: teams
may use “component” or “end-to-end” with different scopes.

| Term | Meaning in this project | Common confusion |
|---|---|---|
| Appium | Automation server that delegates device work to a platform driver | It is not the assertion library |
| UiAutomator2 | Android automation driver used by Appium here | It does not automate iOS |
| WebdriverIO / WDIO | Client and runner that executes specs and sends commands | A test can use WDIO while asserting with Chai |
| TypeScript | JavaScript with static type checking | Type safety does not verify runtime selectors |
| Mocha | Test structure and lifecycle: `describe`, `it`, hooks | It does not itself locate mobile controls |
| Chai | Assertion library imported as `expect` | Its equality assertions do not automatically poll UI state |
| Assertion | Check comparing observed state to an expectation | An action without an assertion proves little behavior |
| Oracle | Basis for deciding the expected result | Current behavior is not always intended behavior |
| Unit / component test | Check of a named small function/module with controlled dependencies | State which parts the component includes |
| Integration test | Check of collaborating parts and their boundary | A replaced dependency limits the integration exercised |
| API test | Check through a programmatic interface | The interface alone does not identify scope or prove UI behavior |
| UI test | Check through visible controls and observations | It can serve smoke or regression purposes |
| End-to-end test | Check of a named journey across its required parts | List real and replaced parts before claiming coverage |
| Test double | Replacement dependency used for a test | Simulated driver behavior is not device evidence |
| Stub / fake | Chosen responses / simplified working behavior | Neither proves the real dependency works |
| Spy / mock | Recorded calls / checked expected interactions | Libraries sometimes use “mock” for several kinds of double |
| Spec | File containing test scenarios | A file may contain many independently reported tests |
| Suite | Related tests or a configured selection of specs | “Full suite” is limited to configured files/environments |
| Hook | Setup or cleanup executed at a lifecycle point | `beforeEach` should establish an intentional state |
| Async / await | Promise-based sequencing of asynchronous operations | Omitting `await` can allow commands to overlap |
| Selector / locator | Description used to find an element | Text, resource IDs, and accessibility IDs differ |
| Accessibility ID | Platform-exposed identifier selected with `~` | Its presence alone does not prove accessibility quality |
| Resource ID | Android resource identifier | Android-only selectors need review for iOS |
| XPath | Query over a UI hierarchy or DOM | Long positional paths couple tests to layout structure |
| Screen object | Encapsulation of selectors and reusable screen actions | Business expectations should remain understandable in specs |
| Capability | Session request parameter such as platform or app | It is not a runtime assertion |
| Session | Connection between client and a provisioned automation target | One CLI run may create several sessions |
| APK | Android installation package | A source repository and an installable app are different artifacts |
| AVD | Android Virtual Device configuration | Emulator is the software that runs an AVD |
| Emulator | Virtual Android device | It does not cover every physical-device behavior |
| ADB | Android Debug Bridge tooling | `adb devices` tests connectivity, not app correctness |
| JDK / JAVA_HOME | Java runtime/toolchain and its configured root | The SDK path is a separate setting |
| ANDROID_HOME | Root of the Android SDK installation | It is not the AVD name |
| UDID | Target device identifier/serial in capabilities | A human-readable device name may be informational locally |
| Native context | Platform UI automation context | CSS selectors normally belong to web context |
| WebView | Embedded web content inside an app | It may need separate driver compatibility |
| Context switch | Change between native and web automation contexts | It does not itself wait for application readiness |
| Polling wait | Repeated observation until a condition or timeout | Repeating side effects inside it can change the outcome |
| Timeout | Bound on waiting/execution | Making it huge rarely identifies a root cause |
| Flake | Inconsistent outcome without an intended relevant change | All unexplained failures are not automatically flakes |
| Retry | Another attempt after failure | It does not repair a cause or erase the first failure |
| Idempotent action | Repeating it has the same intended result as once | “Set switch off” differs from “toggle switch” |
| Isolation | Each test owns the state it requires | A process restart may preserve stored/server data |
| Runtime permission | Android grant required for certain protected features | Auto-granting it does not test deny/recovery behavior |
| Lifecycle transition | Change such as foreground → background → foreground | Backgrounding differs from terminating or reinstalling an app |
| Persistent state | Data intended to outlive a particular process or screen | A clean-looking screen does not prove storage was erased |
| Instrumentation | Android automation code running to observe/control the app | Its crash is distinct from the app under test crashing |
| Fixture | Reusable, controlled test data or setup | Fixtures should not contain real access keys |
| Boundary value | Input at or near a rule's edge | Ordinary values often miss off-by-one mistakes |
| Equivalence class | Inputs expected to behave similarly for a rule | Many values from one class may add little coverage |
| Smoke test | Small check of essential functioning | It is not exhaustive regression |
| Regression test | Check guarding behavior against unintended change | A passing suite proves only its asserted coverage |
| Retest / confirmation | Rerun of the specific previously failing case after a repair | It does not replace wider regression checks |
| CI | Automated checks on an integration platform | Static CI is not necessarily a device test |
| Artifact | Saved evidence such as PNG, XML, or logs | It may contain entered text and needs review before sharing |
| Concurrency | Simultaneous work | It differs from total session count |
| Not run | No execution evidence for that scope | It must not be reported as pass |

[Course index](../README.md)
