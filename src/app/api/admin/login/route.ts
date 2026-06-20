import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_COOKIE = 'sl_admin_session'
const SESSION_VALUE = 'authenticated_suhu_laptop_admin'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (ADMIN_EMAIL && ADMIN_PASSWORD && email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false, error: 'Email atau password salah' }, { status: 401 })
}
