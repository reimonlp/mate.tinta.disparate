# Project Skill Registry

## User Skills

- **branch-pr**: `Create Gentle AI pull requests with issue-first checks. Trigger: creating, opening, or preparing PRs for review.`
- **chained-pr**: `Trigger: PRs over 400 lines, stacked PRs, review slices. Split oversized changes into chained PRs that protect review focus.`
- **cognitive-doc-design**: `Design docs that reduce cognitive load. Trigger: writing guides, READMEs, RFCs, onboarding, architecture, or review-facing docs.`
- **comment-writer**: `Write warm, direct collaboration comments. Trigger: PR feedback, issue replies, reviews, Slack messages, or GitHub comments.`
- **go-testing**: `Trigger: Go tests, go test coverage, Bubbletea teatest, golden files. Apply focused Go testing patterns.`
- **issue-creation**: `Create Gentle AI issues with issue-first checks. Trigger: creating GitHub issues, bug reports, or feature requests.`
- **judgment-day**: `Trigger: judgment day, dual review, adversarial review, juzgar. Run blind dual review, fix confirmed issues, then re-judge.`
- **skill-creator**: `Trigger: new skills, agent instructions, documenting AI usage patterns. Create LLM-first skills with valid frontmatter.`
- **work-unit-commits**: `Plan commits as reviewable work units. Trigger: implementation, commit splitting, chained PRs, or keeping tests and docs with code.`

## Compact Rules

### chained-pr
- Split PRs over **400 changed lines** unless a maintainer explicitly accepts `size:exception`.
- Keep each PR reviewable in about **≤60 minutes**.
- Use one deliverable work unit per PR; keep tests/docs with the unit they verify.
- State start, end, prior dependencies, follow-up work, and out-of-scope items in every chained PR.
- Every child PR must include a dependency diagram marking the current PR with `📍`.
- In Feature Branch Chain, create a draft/no-merge tracker PR; child PR #1 targets the tracker branch, later children target the immediate parent branch.
- Treat polluted diffs as base bugs: retarget or rebase until only the current work unit appears.
- Do not mix chain strategies after the user chooses one.

### go-testing
- Prefer table-driven tests for multiple cases; use `t.Run(tt.name, ...)`.
- Test behavior and state transitions, not implementation trivia.
- Use `t.TempDir()` for filesystem tests; never rely on a real home directory.
- Keep integration tests skippable with `testing.Short()` when they run external commands or slow flows.
- For Bubbletea, test `Model.Update()` directly for state changes; use `teatest` only for interactive flows.
- Golden files must be deterministic; update only through the repo's `-update` path and rerun tests without `-update`.
- Use small mocks/interfaces around system or command execution boundaries.

### judgment-day
- Resolve project skills before launching agents: read skill registry, match compact rules by target files/task, and inject the same `Project Standards` block into both judge prompts and fix prompts.
- Launch **two blind judges in parallel** with identical target and criteria; never review the code yourself.
- Wait for both judges before synthesis; never accept a partial verdict.
- Classify warnings as `WARNING (real)` only if normal intended use can trigger them; otherwise downgrade to INFO as `WARNING (theoretical)`.
- Ask before fixing Round 1 confirmed issues.
- After any fix agent runs, immediately re-launch both judges in parallel before commit/push/done/session summary.
- Terminal states are only `JUDGMENT: APPROVED` or `JUDGMENT: ESCALATED`.
- After 2 fix iterations with remaining issues, ask the user whether to continue.

### skill-creator
- When working in this repo, first follow `docs/skill-style-guide.md` as the normative source before creating or updating skills.
- If that guide is unavailable, use the compact inline rules below.
- A skill is a runtime instruction contract for an LLM, not human documentation.
- Do not add a `Keywords` section; preserve essential trigger words in `description`.
- References must point to local files.
- Keep the skill body concise: target 180–450 tokens, recommended max 700, hard max 1000.

