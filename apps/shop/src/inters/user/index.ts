import z from "zod/v4"

export const zUserInfo = z.object({
  userId: z.number().default(0),
  username: z.string().default(""),
  nickname: z.string().nullable().default(null),
  avatar: z.string().nullable().default(null),
  openId: z.string().nullable().default(null),
  role: z.number().default(0),
})

export type UserInfo = z.infer<typeof zUserInfo>
