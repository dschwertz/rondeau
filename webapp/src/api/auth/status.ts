import { AuthStatusSchema, HttpError, type AuthStatus } from "@/types"

/**
 * @throws {HttpError} if the request fails
 * @throws {z.ZodError} if the response body is malformed
 */
export async function getAuthStatus(): Promise<AuthStatus> {
  const response = await fetch("/v0/auth/status")

  if (!response.ok) {
    throw new HttpError(response.status, response.statusText)
  }

  const result = AuthStatusSchema.parse(await response.json())
  return result
}
