import { createServerClient, serializeCookieHeader } from '@supabase/ssr'

export function createClient(req, res) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies || {}).map((name) => ({
            name,
            value: req.cookies[name],
          }))
        },
        setAll(cookiesToSet) {
          if (!res) return
          cookiesToSet.forEach(({ name, value, options }) => {
            res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
          })
        },
      },
    }
  )
}
