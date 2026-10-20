# My mobile automation evidence journal

Copy this template into your own notes for each lesson. Do not store real credentials,
personal data, access tokens or confidential app screenshots here.

In the course reader, notes are saved only in the current browser and origin.
Use **Export progress** at the end of a session. **Import progress** restores that
JSON backup by combining completed lessons and filling missing notes. If both copies
have different nonempty notes for a lesson, the current browser's note is preserved;
compare the backup manually before editing it. Progress records do not include your
source-code changes: save those separately in Git.

## Session record

- **Date / lesson / exercise ID:**
- **What I expected to learn:**
- **Time spent:** an observation, not a score
- **Environment:** Node, Appium/driver, device model, Android API, app version
- **Command I ran:**
- **Code I changed:**
- **Expected result, written before the run:**
- **Actual result and evidence path:**
- **What the evidence proves:**
- **What it does not prove:**
- **One mistake I can now explain:**
- **Next smallest experiment:**

## Failure investigation

1. **Symptom:** quote the relevant error, excluding secrets.
2. **Reproduction:** smallest command and starting state.
3. **Evidence:** screenshot, UI source, server log, device state.
4. **Hypothesis:** what might explain the symptom?
5. **Experiment:** one change that distinguishes your hypothesis from alternatives.
6. **Result:** confirm, reject, or still uncertain.
7. **Fix and regression check:** how did you prove the behaviour changed?

## Completion gate

- [ ] I completed all exercises or recorded an explicit prerequisite blocker.
- [ ] I can explain every new line I added.
- [ ] I caused a meaningful failure and recognised it.
- [ ] I tested both the relevant individual case and its surrounding suite when needed.
- [ ] I reviewed the solution and can explain any differences.
- [ ] I wrote a next step, rather than only ticking a box.

## Example of useful evidence

“Exercise 07-B: I submitted two empty fields on a restarted Login screen. Before
submitting, both error elements were absent. After submitting, both exact messages
were visible. The local login suite passed. This demonstrates client-side empty-input
validation on this APK and device; it does not demonstrate a real login service.”

[Course map](README.md)
