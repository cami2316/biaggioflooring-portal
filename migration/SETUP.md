# Biaggio Flooring - Supabase setup

1. Open Supabase and create or select the target project.
2. Go to SQL Editor and run the contents of `migration/01_schema.sql`.
3. Optionally run `migration/02_seed_optional.sql` if you want sample rows for testing.
4. In Project Settings, copy the project URL into `migration/.env` as `SUPABASE_URL`.
5. In Project Settings, copy the `service_role` secret into `migration/.env` as `SUPABASE_SERVICE_ROLE_KEY`.
6. Keep that key out of frontend code and rotate it after migration if it was shared insecurely.
7. After schema setup, verify `companies` contains `Biaggio Flooring LLC`.

Validation sequence:

1. `npm install`
2. `npm run extract`
3. Review `migration/invoices_data_full.json` and `migration/extract_report.txt`
4. `npm run import -- --dry-run`
5. `npm run import`