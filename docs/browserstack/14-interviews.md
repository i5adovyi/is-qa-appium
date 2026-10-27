# BS-14 · Explain cloud automation in an interview

**Stage:** Own the result · **Time:** 45–60 minutes per practice round

## Prerequisites

The earlier BrowserStack lessons or an honest record of which ones remain
unexecuted. No account is needed for mock interviews. Real experience and
scenario analysis should be described as different evidence.

## Step by step

1. Pick three prompts below. Give a 60–90 second answer with a concrete example.
2. Use this structure: goal → configuration/action → observed evidence → limit
   → next step. Replace memorized product vocabulary with cause and effect.
3. Have a peer (or assistant) change one fact. Explain what you would inspect
   before changing code. Do not invent a successful cloud run to sound experienced.
4. Review your answer using the hints and the linked lesson. Repeat only the
   weak part, then preserve a short note about the improvement.

| Prompt | Evidence a strong answer includes |
| --- | --- |
| Where does Appium run when you use BrowserStack? | Runner vs remote server/device; local package versions don't lock remote versions |
| App Live, Automate or App Automate? | Manual app interaction vs web automation vs native app automation |
| How does the APK get to the phone? | Checksum → upload → exact `bs://` ID → capability; no laptop path on remote device |
| How do you run exactly one test? | Spec selection plus title filter; verify a nonzero actual count |
| Why does local pass but cloud fail? | Artifact/version/device/state/network differences, earliest failure, one distinguishing observation |
| One session contains three tests: how do you report it? | Case counts vs session count; aggregate failure retained |
| Dashboard says done; assertion failed—what now? | Runner outcome, status-hook warning, provider status; no false pass |
| Why not enable retries everywhere? | First-attempt failures, extra time/sessions and causal diagnosis |
| How many sessions for four files and three devices? | Potential twelve under stated scheduling; concurrency is a separate limit |
| Why do parallel tests fail only together? | Shared backend data/report paths, ownership and cleanup |
| Can cloud devices reach a private backend? | App-origin evidence, tunnel identity, DNS/proxy/TLS distinction |
| What belongs in a release report? | Commit/app/device, scope/counts, first failures/reruns, evidence and missing coverage |
| What does a successful upload or green typecheck prove? | Local/artifact/setup facts, not device assertions |
| Does installing analytics make your tests trustworthy? | Ingestion/reporting doesn't repair assertions or missing cases |
| How do you protect credentials and artifacts? | Local/CI secret sources, rotation, review sharing/retention, no public raw data |

## Exercises

### BS-14-A · Five-minute incident interview

**Task:** choose a random [incident card](incidents.md). Spend one minute restating
facts, two on hypotheses/observations, one on the smallest repair and one on
reporting/remaining risk. Ask a reviewer to change one premise.
**Acceptance:** evidence-driven reasoning, no guessed root cause presented as
fact, correct execution limits and a clear next action.

<details><summary>Hint and review</summary>
“I would inspect X to distinguish A from B” is stronger than listing twenty
tools. If the session never started, video cannot be your first evidence source.
</details>

### BS-14-B · Defend your capstone

**Task:** present your BS-13 packet in five minutes, then answer: “what did you
not test?”, “how do you know your assertion catches a bug?” and “what changes
when ten workers use the same account?”
**Acceptance:** actual evidence or an explicitly unexecuted design, controlled
failure proof when available, and a concrete isolation/coverage explanation.

<details><summary>Hint and review</summary>
Do not confuse the BrowserStack account that provisions devices with an app's
backend test account. Device allocation and business-data ownership are separate.
</details>

## Checkpoint

Return to the lesson behind your weakest answer and do its exercise. See also
the existing [48 interview questions](../handbook/interview-practice.md),
[practical drills](../handbook/interview-drills.md) and [CH-11](../challenges/11-cloud-smoke.md).

[Previous](13-capstone.md) · [Path](README.md) · [Incident bank](incidents.md)
