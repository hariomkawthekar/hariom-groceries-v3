import { createServerClient, serializeCookieHeader } from '@supabase/ssr'

export function createClient(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url || !key || url.includes('placeholder') || !url.startsWith('https://')) {
    return null
  }

  return createServerClient(
    url,
    key,
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
