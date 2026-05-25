import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { UserRole } from '@prisma/client'
import { prisma } from './prisma'

const SESSION_COOKIE = 'atm_session'
const MAX_AGE = 60 * 60 * 24 * 30

interface SessionPayload {
  userId: string
  email: string
  role: UserRole
  exp: number
}

const base64url = (value: string | Buffer) => Buffer.from(value).toString('base64url')

const getSecret = (event: H3Event) => {
  const config = useRuntimeConfig(event)
  const secret = String(config.authSessionSecret || config.googleClientSecret || config.razorpayKeySecret || '').trim()

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Auth session secret is not configured.'
    })
  }

  return secret
}

const sign = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url')

const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export const setUserSession = (event: H3Event, payload: Omit<SessionPayload, 'exp'>) => {
  const data: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE
  }
  const encoded = base64url(JSON.stringify(data))
  const signature = sign(encoded, getSecret(event))

  setCookie(event, SESSION_COOKIE, `${encoded}.${signature}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE
  })
}

export const clearUserSession = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export const getSessionPayload = (event: H3Event): SessionPayload | null => {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null

  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return null

  const expected = sign(encoded, getSecret(event))
  if (!safeEqual(expected, signature)) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload
    if (!payload.userId || payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export const requireUser = async (event: H3Event) => {
  const payload = getSessionPayload(event)

  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required.'
    })
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      googleId: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  if (!user) {
    clearUserSession(event)
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required.'
    })
  }

  return user
}

export const requireAdmin = async (event: H3Event) => {
  const user = await requireUser(event)

  if (user.role !== UserRole.admin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required.'
    })
  }

  return user
}
