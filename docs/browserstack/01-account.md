# BS-01 · Create an account and find the right product

**Stage:** Get ready · **Time:** 30–60 minutes, plus any account approval

## Prerequisites

[BS-00](00-start.md), a browser and an email/account you control. Company users
should use their team's invitation and approved sign-in process. The offline
exercise remains available without registration.

## Step by step

1. Open [BrowserStack signup](https://www.browserstack.com/users/sign_up), or
   accept your company's invitation. Complete the offered registration and
   email/identity verification. Do not create a second account to evade limits.
2. Sign in and open **App Automate**, from the product selector or
   [App Automate dashboard](https://app-automate.browserstack.com/).
3. Check the selected organization/team. Confirm App Automate access, remaining
   usable time/usage and allowed simultaneous sessions. Trial terms and plans
   vary; the course does not promise free minutes or require a purchase. If
   access is missing, save the exact blocker and ask your administrator or the
   provider through your own account.
4. Open [account settings](https://www.browserstack.com/accounts/settings).
   Locate the automation **username** and **access key**. In the newer dashboard
   these may also be accessible through **Access Keys**. Do not use your email
   password as the automation key. Leave the values in the account page until
   you have the local `.env` file ready in BS-02.
5. Check the signed-in device selector. Choose one Android device/OS combination
   available to the account. Write the nonsecret names into your readiness note.
6. An empty builds list is normal before a first automated run. Do not start an
   App Live session merely to make this page nonempty.

**Ready to continue:** you know which team has App Automate access, where its
automation credentials are, and which device/OS pair you intend to request.
Write only nonsecret facts in the readiness note. If the account cannot run a
session or its allowance is unclear, record that blocker rather than purchasing
anything just to finish the lesson. You can still prepare Node/project files in
BS-02 and analyze the [offline incident cards](incidents.md).

| Product | Purpose | This project |
| --- | --- | --- |
| App Live | Manually interact with a mobile app on a remote device | Optional investigation; manual taps do not execute a spec |
| App Automate | Execute mobile app automation | Our Appium Android route |
| Automate | Website/browser automation | Different test target |
| Test Reporting & Analytics | Test reporting and analysis; also hosts newer dashboard navigation | Test-level ingestion is a separate integration question |

See the official [App Live description](https://www.browserstack.com/docs/app-live)
and [App Automate quickstart](https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio).

## Credentials without surprises

Treat the access key as a password. Paste it only into your local ignored `.env`
or the CI secret store. Never paste it into this Site, a lesson note, chat, a
committed spec, a screenshot or a command line. A private repository is still
not a secret store. [BS-12](12-maintenance.md) covers rotation and accidental exposure.

The account page and product menus may differ by account or dashboard migration.
Record the product and resource you found, not a memorized sequence of clicks.
An account registration is not proof that App Automate execution is enabled.
If a setup wizard offers generated sample code, keep it as a reference. This
course already has a launcher and configuration; replacing them with a sample
would change the project you are learning. Follow BS-02 for this repository.

## Exercises

### BS-01-A · Account readiness handover

**Task:** fill product, organization, access status, usage allowance and selected
device/OS in the readiness template. Use “not available” when unknown.
**Acceptance:** either a ready checklist without secret values, or a blocker
with the exact missing access and next owner/action. No cloud run is required.

<details><summary>Hint and review</summary>
“I can log in” is weaker than “App Automate is enabled for this team and one
session is permitted.” Record the observation date because usage changes.
</details>

### BS-01-B · Wrong-product incident

**Task:** a teammate opens App Live, taps Login and writes “our automation
passed.” Draft a helpful correction and a verification plan.
**Acceptance:** distinguish manual evidence from spec execution, name App
Automate, and identify the missing runner output/session correlation.

<details><summary>Hint and review</summary>
Their manual observation may be useful. It does not establish that selectors,
waits, assertions or the test runner work. This is an offline scenario.
</details>

## Checkpoint

Can you find automation credentials without displaying them to another person,
and explain which product the first test will use?

[Previous](00-start.md) · [Path](README.md) · [Next: prepare the project](02-project.md)
