'use server'

import { cookies } from 'next/headers'

const ADMIN_EMAIL = 'admin@suhulaptop.id'
const ADMIN_PASSWORD = 'SuhuLaptop2026!'
const SESSION_COOKIE = 'sl_admin_session'
const SESSION_VALUE = 'authenticated_suhu_laptop_admin'

export async function adminLogin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return { ok: true }
  }
  return { ok: false, error: 'Email atau password salah' }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE
}
