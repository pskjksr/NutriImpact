// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareSupabaseClient({ req, res })

    const { data: { session } } = await supabase.auth.getSession()
    const url = req.nextUrl

    // เส้นทางที่ต้องล็อกอิน
    const PROTECTED_PREFIXES = ['/Findevaluationresults', '/graph']
    const isProtected = PROTECTED_PREFIXES.some(p => url.pathname.startsWith(p))

    // หน้าล็อกอิน/สมัคร/ลืมรหัส ที่ไม่ควร redirect ถ้าหลุดมา
    const isAuthPage =
        url.pathname.startsWith('/Login') ||
        url.pathname.startsWith('/SingUp') ||
        url.pathname.startsWith('/ForgotPassword') ||
        url.pathname.startsWith('/password') ||
        url.pathname.startsWith('/success') ||
        url.pathname.startsWith('/OTP')

    if (isProtected && !session) {
        const loginUrl = url.clone()
        loginUrl.pathname = '/Login'
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname) // เก็บปลายทางไว้
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthPage && session) {
        const homeUrl = url.clone()
        homeUrl.pathname = '/Findevaluationresults'
        return NextResponse.redirect(homeUrl)
    }

    return res
}

export const config = {
    matcher: [
        '/Findevaluationresults/:path*',
        '/graph/:path*',
        '/Login',
    ],
}
