import { z } from 'zod';

export const GameSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(2, { message: "Must be 2 or more characters long" }),
    release_year: z.number().gte(1970),
    image: z.string().optional()
})


export type GameType = z.infer<typeof GameSchema>