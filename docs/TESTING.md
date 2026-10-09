# Testing EduSpark

EduSpark does not yet have an automated test suite. Use this checklist for every release candidate and for changes that affect shared navigation, storage, language, or styling.

## Start-up

- [ ] Run `./server.ps1` without an error.
- [ ] Open `http://localhost:8082` and confirm the dashboard renders.
- [ ] Confirm the browser console has no uncaught errors on initial load.
- [ ] Confirm an unknown path returns HTTP 404.

## Dashboard and navigation

- [ ] Open each enabled tool and return to the dashboard.
- [ ] Confirm the unavailable PhonicLab card cannot be launched.
- [ ] Switch between English and Georgian from the dashboard and each activity.
- [ ] Confirm stars, streak, and progress summaries render without layout overflow.

## YonRead

- [ ] Select each built-in story.
- [ ] Start, pause, resume, and reset playback.
- [ ] Change WPM before and during playback.
- [ ] Increase and decrease the reading font size.
- [ ] Complete a story and confirm progress is recorded once.

## TypoSnap

- [ ] Complete an untimed 15-word session.
- [ ] Run a 60-second challenge and verify the timer and score.
- [ ] Check correct and incorrect letter feedback.
- [ ] Switch between built-in and custom word sources.

## GuessingSnap

- [ ] Complete an untimed 15-word session.
- [ ] Run a 60-second challenge and verify the timer and score.
- [ ] Check correct and incorrect word-choice feedback.
- [ ] Use the spoken-word control in a browser with speech synthesis enabled.

## Parent mode and custom content

- [ ] Verify an incorrect arithmetic answer keeps parent mode locked.
- [ ] Verify a correct answer unlocks both parent tabs.
- [ ] Add and remove a custom word.
- [ ] Confirm the 10-word custom-deck limit behaves correctly.
- [ ] Add a custom story manually.
- [ ] Import a UTF-8 `.txt` story and confirm its title and content.
- [ ] Use the custom story in YonRead.

## Persistence and privacy

- [ ] Reload the page and confirm language, progress, and custom content persist.
- [ ] Clear site data and confirm the app recovers to its default state.
- [ ] Confirm normal use produces no application network requests to third parties.
- [ ] Confirm no real learner information appears in commits, fixtures, or screenshots.

## Responsive and accessibility checks

- [ ] Test at approximately 375 px, 768 px, and 1280 px viewport widths.
- [ ] Zoom to 200% and confirm primary controls remain reachable.
- [ ] Navigate interactive controls with the keyboard and record any blockers.
- [ ] Check focus visibility and modal focus behavior.
- [ ] Check the experience with reduced-motion enabled.
- [ ] Run a browser accessibility audit and record unresolved findings.
