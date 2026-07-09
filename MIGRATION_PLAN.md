# Bliss → Full Next.js Migration Plan

## Current State
- Next.js 16 serves public pages (Landing, Property Listing, Lead Capture)
- React Router SPA handles auth pages + dashboard (only via Vite)
- Dashboard is broken in Next.js build ("Loading…" placeholder)

## Migration Strategy
1. Update `next.config.ts` for production readiness
2. Create auth middleware for route protection
3. Create proper layout hierarchy (auth layout, dashboard layout)
4. Replace `react-router-dom` with `next/navigation` in all components
5. Create Next.js page files for all routes
6. Add SEO metadata to all pages
7. Remove Vite dependencies/config

## Import Mappings
| react-router-dom | next/navigation |
|---|---|
| `useNavigate()` | `useRouter().push()` |
| `useParams()` | `useParams()` |
| `useLocation()` | `usePathname()` |
| `useSearchParams()` | `useSearchParams()` |
| `Link` | `Link` from `next/link` |
| `NavLink` | Custom with `usePathname` |
| `Navigate` | `redirect()` or `router.replace()` |
| `Outlet` | `{children}` in layout |
| `Routes`/`Route` | File-based routing |
| `BrowserRouter` | Not needed |