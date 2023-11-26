import { z } from 'zod';

const GameSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2, { message: "Must be 2 or more characters long" }),
    release_year: z.number().gte(1970),
})

export default GameSchema;