import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl

  console.log('Middleware executing for:', url.pathname)
  console.log('User authenticated:', !!user)

  // Define public routes
  const publicRoutes = [
      '/Login',
      '/SingUp',
      '/OTP',
      '/ForgotPassword',
      '/password',
      '/success',
      '/finishotp',
      '/newpassword',
      '/resetpassword'
  ]

  const isRoot = url.pathname === '/'
  const isPublicPath = publicRoutes.some(route => url.pathname.startsWith(route))
  const isPublicRoute = isRoot || isPublicPath
  
  console.log('Is public route:', isPublicRoute)

  // If user is logged in and tries to access a public auth route, redirect to dashboard
  if (user && isPublicRoute) {
      console.log('Redirecting logged-in user to dashboard')
      const dashboardUrl = url.clone()
      dashboardUrl.pathname = '/Findevaluationresults'
      return NextResponse.redirect(dashboardUrl)
  }

  // If user is NOT logged in and tries to access a protected route, redirect to Login
  if (!user && !isPublicRoute) {
      console.log('Redirecting unauthenticated user to Login')
      const loginUrl = url.clone()
      loginUrl.pathname = '/Login'
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
