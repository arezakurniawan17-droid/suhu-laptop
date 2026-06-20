import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE = 'sl_admin_session'
const SESSION_VALUE = 'authenticated_suhu_laptop_admin'
const PROTECTED = /^\/admin(?!\/login)/

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PROTECTED.test(pathname)) {
    const session = req.cookies.get(SESSION_COOKIE)?.value
    if (session !== SESSION_VALUE) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
