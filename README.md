# EduSpark

EduSpark is a local-first reading fluency and vocabulary practice app for children ages 6–10. It combines short, game-like activities with parent-managed content and keeps learning data in the browser rather than sending it to a backend service.

> **Project status:** functional prototype. The core activities run in a modern browser, but automated tests, production hosting, and a formal accessibility audit are not yet in place.

## What children can practice

| Tool | Skill | Current experience |
| --- | --- | --- |
| **YonRead** | Reading fluency and visual focus | Displays one word at a time using RSVP, with adjustable reading speed, font size, and story selection. |
| **TypoSnap** | Spelling and letter recognition | Asks learners to complete illustrated words in an untimed 15-word session or a 60-second challenge. |
| **GuessingSnap** | Vocabulary and word recognition | Presents an illustration and four word choices, with standard and timed modes plus optional spoken prompts. |

The dashboard also tracks stars, XP, words read, spelling progress, and activity history. **PhonicLab** is shown as a planned activity and is not currently available.

## Additional features

- English and Georgian interface modes
- Built-in English and Georgian reading passages
- A 50-word illustrated vocabulary deck
- Parent mode protected by a simple arithmetic gate
- Parent-added custom words and stories
- Plain-text story import
- Browser-generated sound effects and speech synthesis
- Responsive, dependency-free browser UI

## Quick start

### Requirements

- Windows PowerShell 5.1 or PowerShell 7+
- A current version of Chrome, Edge, Firefox, or another modern browser
- Browser speech-synthesis support for spoken-word prompts

### Run locally

```powershell
git clone https://github.com/DrKogMaw/eduspark.git
cd eduspark
.\server.ps1
```

Open <http://localhost:8082> and stop the server with `Ctrl+C` when finished.

The app uses native JavaScript modules, so opening `index.html` directly from the filesystem is not recommended. The included server supplies the required HTTP origin and content types.

## Data and privacy

EduSpark has no application backend, user accounts, analytics, advertising, or cloud synchronization. Progress, language choice, custom words, and custom stories are stored in the browser's `localStorage` for the current origin.

This means:

- learning data stays on the device and browser profile;
- clearing site data resets stored progress and custom content;
- data does not automatically move between browsers or devices;
- uploaded text stories are read locally by the browser.

EduSpark is an educational prototype, not a medical, diagnostic, or formal assessment tool. Parents and educators should review custom content before giving it to a child.

## Project structure

```text
eduspark/
├── index.html                    # Browser entry document
├── server.ps1                   # Local static HTTP server
├── styles/main.css              # Shared application styles
└── src/
    ├── main.js                  # Runtime entry point
    └── app/
        ├── app.component.js     # Navigation and global interaction handlers
        ├── components/          # Dashboard, learning tools, and parent modal
        └── core/                # Models plus progress, sound, i18n, and registry services
```

JavaScript files are the browser runtime. TypeScript source files are retained for several modules, but the repository does not currently include a TypeScript build pipeline and the source sets are not yet fully synchronized. See [Architecture](docs/ARCHITECTURE.md) before making structural changes.

## Verification

There is currently no automated test suite. Before merging or publishing a change, run the manual checks in [Testing](docs/TESTING.md), including both languages, all three activities, parent mode, persistence, and a narrow mobile viewport.

## Accessibility

The interface uses large controls, strong color contrast, adjustable reading text, and touch-friendly layouts. Accessibility work is still incomplete: keyboard navigation, screen-reader behavior, reduced-motion preferences, and automated accessibility testing need a dedicated review before a production release.

## Roadmap

- Add automated unit and browser tests
- Complete the TypeScript migration and add a reproducible build process
- Perform keyboard, screen-reader, contrast, and reduced-motion audits
- Add export, import, and reset controls for local progress
- Improve parent controls and content validation
- Add PhonicLab audio exercises
- Publish a versioned public demo

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting changes. Keep child safety, truthful progress reporting, privacy, and bilingual behavior in scope when modifying the product.

## License

No open-source license has been selected yet. Until a license file is added, the repository's contents remain under the copyright holder's default rights and should not be redistributed or reused without permission.
