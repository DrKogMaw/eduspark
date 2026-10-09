# EduSpark

EduSpark is a browser-based reading fluency and vocabulary platform for children ages 6–10. It includes:

- YonRead, an RSVP speed-reading activity
- TypoSnap, a visual spelling challenge
- Local progress tracking and a parent view

## Run locally

The application is static and has no external runtime dependencies. On Windows, open PowerShell in the project directory and run:

```powershell
.\server.ps1
```

Then visit <http://localhost:8082>.

## Privacy and configuration

The application stores progress locally in the browser. Do not commit environment files, signing keys, credentials, or service-account files; the included `.gitignore` excludes common sensitive file types.
