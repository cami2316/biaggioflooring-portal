# Biaggio Flooring - Google Sheets API setup

1. In Google Cloud, create or choose a project.
2. Enable both Google Drive API and Google Sheets API.
3. Create a service account for the migration.
4. Create a JSON key for that service account and download it.
5. Save the file as `migration/google-service-account.json`.
6. Share the Drive folder with the service account email as Viewer.
7. Copy `migration/.env.example` to `migration/.env` and set `DRIVE_FOLDER_ID`.

Quick check:

1. Run `npm run extract`
2. If you get read failures, confirm the folder was shared with the service account and the file is native Google Sheets.