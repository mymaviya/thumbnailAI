import { getSessionPayload, requireUser } from '~/server/utils/auth'
import { serializeUser } from '~/server/utils/serializers'

export default defineEventHandler(async event => {
  const session = getSessionPayload(event)
  if (!session) {
    return { user: null }
  }

  const user = await requireUser(event)
  return { user: serializeUser(user) }
})
