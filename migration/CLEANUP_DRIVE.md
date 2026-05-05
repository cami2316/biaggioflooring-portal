# Biaggio Flooring - Drive cleanup

1. Put every invoice spreadsheet you want to migrate into one Google Drive folder.
2. Convert important `.xlsx` files into native Google Sheets. The extractor skips `.xlsx` files.
3. Remove duplicate files, blank templates, and outdated copies you do not want imported.
4. Rename files consistently so project codes are easier to infer from filenames.
5. Keep one invoice per spreadsheet whenever possible.
6. Confirm the Google service account email has at least Viewer access to the folder.

When cleanup is done, copy the Drive folder ID into `migration/.env` as `DRIVE_FOLDER_ID`.