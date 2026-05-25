import { clearUserSession } from '~/server/utils/auth'

export default defineEventHandler(event => {
  clearUserSession(event)
  return { ok: true }
})
