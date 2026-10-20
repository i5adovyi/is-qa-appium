# Project context for a fresh assistant

This is a beginner-to-workplace mobile automation training repository, not a
production application. Read `docs/RESUME.md` for the handover and
`docs/validation.md` for actual execution evidence. The learner is practising
Appium, TypeScript, Chai and BrowserStack from the foundations.

- Preserve learner edits. Offline `starter.ts` files intentionally start
  unfinished (01–10) or faulty (11–12); do not copy reference implementations
  into them unless asked.
- Use Node 24. `npm run check` validates types, course structure, reference labs
  and framework helpers; `npm run course:test` checks the local reader.
- `npm run practice -- NN` grades the learner file. `npm run practice:solutions`
  grades the references. A starter failure is expected before implementation.
- Mobile tests require an emulator/device. BrowserStack requires the user's
  own account and credentials. Never call a design exercise or a mocked run a
  successful mobile/cloud test.
- Keep `.env`, keys, logs, APKs and personal progress backups out of commits.
  Read `.env.example` for variable names; do not print local secret values.
- Preserve checksum verification and the documented unbundled driver package
  when editing dependencies. See `docs/handbook/dependency-maintenance.md`.
- Keep new exercises reachable from the course map/reader. Include prerequisites,
  a concrete task, acceptance criteria, hints or a review guide, and execution
  limits. Run the relevant course checks after edits.
