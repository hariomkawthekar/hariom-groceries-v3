---
name: supabase
description: Best practices, instructions, and scripts for working with Supabase in Next.js (Auth, Database, SSR, Storage).
---

# Supabase Agent Skill for Next.js

This skill provides ready-made instructions and usage patterns for Supabase in this Next.js project.

## Project Environment Setup

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous public API key
- `DATABASE_URL`: PostgreSQL connection string for Prisma

## Client Helpers

1. **Browser Client**:
   ```javascript
   import { createClient } from '@/utils/supabase/client'
   const supabase = createClient()
   ```

2. **API Route Client**:
   ```javascript
   import { createClient } from '@/utils/supabase/api'
   const supabase = createClient(req, res)
   ```

3. **Session Refresh Middleware**:
   Located in `middleware.js` in project root.

## Best Practices

- Always guard against uninitialized Supabase URL/Key to prevent runtime crashes.
- Use `supabase.auth.onAuthStateChange` in AuthContext to listen for login/logout events.
- For Prisma with Supabase, set `provider = "postgresql"` in `prisma/schema.prisma`.
