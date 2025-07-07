import z from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
    NEXT_PUBLIC_URL: z.string().url(),
});

const config = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

if (!config.success) {
    console.error("Invalid environment variables:", config.error.format());
    throw new Error("Invalid environment variables");
}
const envConfig = config.data;
export default envConfig;
