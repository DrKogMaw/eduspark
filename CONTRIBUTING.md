# Contributing to EduSpark

Thank you for helping improve EduSpark. Changes should make the product safer, clearer, more useful, or easier to maintain for children, parents, and educators.

## Before starting

1. Check the existing implementation and open work before introducing a new pattern.
2. Keep the change focused enough to review and verify in one pull request.
3. Do not add analytics, remote storage, third-party trackers, or personal-data collection without an explicit product and privacy review.
4. Never commit credentials, private keys, environment files, or real children's information.

## Development workflow

1. Create a short-lived branch from `main`.
2. Run the app with `./server.ps1`.
3. Make the smallest coherent change.
4. Follow the checklist in [`docs/TESTING.md`](docs/TESTING.md).
5. Update user-facing documentation when behavior changes.
6. Use a commit message that describes the result, not the editing process.

## Code expectations

- Prefer browser-native APIs and keep the application usable without a backend.
- Preserve English and Georgian behavior when changing visible text or learning content.
- Treat the JavaScript modules as the current runtime source.
- Keep related TypeScript files synchronized when they exist, and call out any unavoidable mismatch.
- Validate and normalize parent-provided content before using or persisting it.
- Avoid introducing dependencies unless their value outweighs their maintenance and privacy cost.
- Keep controls usable with touch, keyboard, zoom, and narrow viewports.

## Pull request checklist

- [ ] The change has a clear user or maintenance benefit.
- [ ] No secrets, generated output, or personal learner data are included.
- [ ] All relevant manual tests pass.
- [ ] English and Georgian views were checked when applicable.
- [ ] Persistence behavior was checked when storage code changed.
- [ ] Documentation matches the resulting behavior.
- [ ] Known limitations and follow-up work are stated plainly.
