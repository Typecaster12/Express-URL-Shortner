import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().int().positive().default(3000)
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error(result.error.format());
    process.exit(1);
}

export const PORT = result.data.PORT;
