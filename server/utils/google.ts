interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token?: string
}

interface GoogleUserResponse {
  sub: string
  name: string
  email: string
  picture?: string
  email_verified?: boolean
}

export const getGoogleRedirectUri = (event: any) => {
  const config = useRuntimeConfig(event)
  return `${config.public.siteUrl}/api/auth/google/callback`
}

export const getGoogleAuthUrl = (event: any, state: string) => {
  const config = useRuntimeConfig(event)
  const params = new URLSearchParams({
    client_id: String(config.googleClientId),
    redirect_uri: getGoogleRedirectUri(event),
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export const exchangeGoogleCode = async (event: any, code: string) => {
  const config = useRuntimeConfig(event)

  return await $fetch<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: String(config.googleClientId),
      client_secret: String(config.googleClientSecret),
      redirect_uri: getGoogleRedirectUri(event),
      grant_type: 'authorization_code'
    })
  })
}

export const fetchGoogleUser = async (accessToken: string) => {
  return await $fetch<GoogleUserResponse>('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
