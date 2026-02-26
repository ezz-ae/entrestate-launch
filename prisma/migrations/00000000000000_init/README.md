This migration creates the initial tables required for the Neon/Postgres data model:

- tenants
- users (admin/team)
- projects
- leads
- campaigns
- uploads (with upload kinds)
- agent_training
- orders

Run `npx prisma migrate deploy` after setting `DATABASE_URL` to apply this migration on a Neon/Postgres instance.
