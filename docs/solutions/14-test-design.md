# 14 · Solutions and reasoning

[Return to exercises](../lessons/14-test-design.md).

## 14-A · Decision table

These expectations come from the demo's displayed validation rules and must be checked against the installed build:

| Valid-shaped email | Password ≥8 chars | Email message | Password message | Demo success predicted |
|---|---|---|---|---|
| No | No | Visible | Visible | No |
| No | Yes | Visible | Absent | No |
| Yes | No | Absent | Visible | No |
| Yes | Yes | Absent | Absent | Yes |

Use ordinary ASCII password samples when isolating length. Unicode length rules, whitespace trimming, and real account status are separate investigations. The valid/valid row is demo input acceptance, not proof of backend authentication.

## 14-B · Exploratory charter

```text
Mission: Explore Forms text and switch state across navigation and keyboard changes.
Timebox: 20 minutes.
Resources: Current demo APK, local emulator, notes and screenshots.
Risks: Unexpected data loss, stale echo, keyboard obstructing controls.
Actions: Populate text; open keyboard; navigate away/back; toggle switch; revisit.
Observations: Record actual values and state after each action.
Questions: Is state retention intended? Does a process restart have a different contract?
Candidate automation: A specified navigation/retention behavior, once its oracle is agreed.
```

Do not fill “observations” with predicted results. If no specification establishes retention, report it as a question. Automation should encode a justified rule, not freeze an accidental behavior.

For the interruption variant, record the entered draft before backgrounding, the duration/action used to return, the resumed screen, and the exact remaining text. Do not invoke the restart helper between those observations: that would change the investigation from resumption to process restart. Permission-flow candidates require an actual permission-using feature and a verified starting grant state; the current automatic-grant config is insufficient.

## 14-C · Smaller, better-focused suite

One possible replacement:

1. Successful demo login with a representative valid-shaped email and password.
2. Both fields empty.
3. Malformed email with acceptable-length password.
4. Valid-shaped email with seven-character password.
5. Eight-character boundary acceptance.
6. Invalid submission followed by correction and successful submission.
7. A keyboard/layout interaction check on a justified device variant.

Retain more email data if it covers genuinely different parsing risks, such as supported plus addressing, rather than ordinary strings from the same class. Defer large combinatorial validation sets to lower-level tests when the app source becomes available. Keep manual exploration for unknown behavior, accessibility, and visual or interaction concerns not covered by these assertions.

A test deserves to exist when its cost is justified by the risk and evidence it adds. The same reasoning can justify adding tests as well as removing them.

[Next lesson](../lessons/15-capstone.md)
