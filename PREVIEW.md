# Local Preview / Demo Mode

## Install

```bash
pnpm install
```

## Run locally

```bash
pnpm dev
```

Open:
- `http://localhost:3000/`
- `http://localhost:3000/preview`

## Demo identities (local-only)

Use `?as=` query string on any `/preview/<route>` page:
- `demo-owner` (`owner.demo@acuity.local`)
- `demo-client` (`client.demo@acuity.local`)
- `demo-contributor` (`contrib.demo@acuity.local`)

Example:
- `http://localhost:3000/preview/admin-calendar?as=demo-owner`

## Clickable preview routes

- `/preview/public-scheduler`
- `/preview/client-self-service`
- `/preview/admin-calendar`
- `/preview/clients-crm`
- `/preview/money-surfaces`
- `/preview/communications`
- `/preview/integrations-sync`
- `/preview/reports`
- `/preview/manage-users`
- `/preview/manage-billing`

## Backend/domain-only (not visually reviewable yet)

- `domain-events`
- `worker-jobs`

## Not implemented yet

- `native-app`
