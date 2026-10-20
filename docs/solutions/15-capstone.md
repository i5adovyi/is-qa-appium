# 15 · A defensible capstone approach

[Return to the brief](../lessons/15-capstone.md).

There is no single correct final suite. This model shows the expected quality of reasoning; it is not an additional executed suite shipped under the default test command.

## 15-A · Scope example

Theme: **Forms interaction quality with login recovery**.

| Candidate | Risk | Decision |
|---|---|---|
| Existing text echo | Binding broken | Keep baseline |
| Existing clear input | Stale result after clear | Keep baseline |
| Replace populated text with a different value | Old value appended or retained | Add |
| Switch on, then explicitly off | Setter/postcondition regression | Add |
| Dropdown selects a newly inspected option | Selection not reflected | Add after inspecting selectors and behavior |
| Invalid login corrected to valid input | Stale validation prevents recovery | Add |
| Hybrid remote content | Context/network complexity | Separate optional exploration |
| Real account authentication | Backend not present in demo | Explicitly out of scope |

The dropdown and recovery cases add behaviors absent from the basic examples. If your baseline already includes one of these, select another genuine gap. Do not count renamed cases as additions.

## 15-B · Implementation example

For recovery, arrange a fresh Login screen, submit invalid values, verify both errors, replace them with valid demo values, then wait for and assert the success alert. Close it. The scenario intentionally contains two submissions because recovery is the behavior under test; it is not a disguised batch of independent validation cases.

For dropdown selection, inspect the installed app first. Add a focused screen action using observed selectors. Verify the selected label before and after selection. Do not paste an invented resource ID.

Evidence inventory:

```text
Baseline: command, environment, result
New cases: named results when run individually
Full suite: command and counts
Injected defect: exact changed line and failed result
Diagnostics: matching filenames and what they show
Restoration: exact repair and final passing result
```

If a new case fails in the suite but passes alone, investigate state ownership before adding retries.

## 15-C · Handover example

A useful five-minute demonstration:

1. **30 seconds:** problem, scope, device/app version.
2. **60 seconds:** exact setup/run command and relevant configuration.
3. **90 seconds:** one scenario, its screen action, wait, and assertion.
4. **90 seconds:** an injected failure and the evidence that identifies it.
5. **30 seconds:** final results, unrun areas, next improvement.

The maintainer guide should say where selectors live, how state is established, how secrets are supplied, and how to run one file. Link actual evidence without exposing private data.

Core success is a coherent Android result with accurate limitations. Cloud, iOS, gestures, or hybrid claims need their own demonstrated evidence. Use the [rubric](../handbook/capstone-rubric.md) to assess quality rather than the size of the codebase.

[Course index](../README.md)
