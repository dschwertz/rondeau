import { z } from "zod"

export const AuthStatusSchema = z.object({
  isAuthenticated: z.boolean(),
  message: z.string(),
  user: z.optional(
    z.object({
      email: z.string(),
    }),
  ),
})

export type AuthStatus = z.infer<typeof AuthStatusSchema>

export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)

    this.name = "HttpError"
    this.status = status
  }
}
