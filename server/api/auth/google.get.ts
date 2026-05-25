import { randomBytes } from 'node:crypto'
import { getGoogleAuthUrl } from '~/server/utils/google'

export default defineEventHandler(event => {
  const config = useRuntimeConfig(event)

  if (!config.googleClientId || !config.googleClientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Google OAuth is not configured.'
    })
  }

  const state = randomBytes(24).toString('base64url')
  setCookie(event, 'atm_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600
  })

  return sendRedirect(event, getGoogleAuthUrl(event, state))
})
