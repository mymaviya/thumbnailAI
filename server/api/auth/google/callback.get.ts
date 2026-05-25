import { UserRole } from '@prisma/client'
import { exchangeGoogleCode, fetchGoogleUser } from '~/server/utils/google'
import { prisma } from '~/server/utils/prisma'
import { setUserSession } from '~/server/utils/auth'

export default defineEventHandler(async event => {
  const query = getQuery(event)
  const code = String(query.code || '')
  const state = String(query.state || '')
  const expectedState = getCookie(event, 'atm_oauth_state')

  deleteCookie(event, 'atm_oauth_state', { path: '/' })

  if (!code || !state || !expectedState || state !== expectedState) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Google OAuth callback.'
    })
  }

  const token = await exchangeGoogleCode(event, code)
  const googleUser = await fetchGoogleUser(token.access_token)

  if (!googleUser.email || !googleUser.sub || googleUser.email_verified === false) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Google account email must be verified.'
    })
  }

  const user = await prisma.user.upsert({
    where: { email: googleUser.email },
    create: {
      name: googleUser.name || googleUser.email,
      email: googleUser.email,
      googleId: googleUser.sub,
      avatar: googleUser.picture || null,
      role: UserRole.user
    },
    update: {
      name: googleUser.name || googleUser.email,
      googleId: googleUser.sub,
      avatar: googleUser.picture || null
    }
  })

  setUserSession(event, {
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return sendRedirect(event, user.role === UserRole.admin ? '/admin' : '/dashboard')
})
