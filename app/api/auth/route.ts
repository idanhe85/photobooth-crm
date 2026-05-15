import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.CRM_PASSWORD || 'Kaiku1985'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('crm-auth', 'true', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ success: true })
  res.cookies.delete('crm-auth')
  return res
}
