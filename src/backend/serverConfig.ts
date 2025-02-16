import z from 'zod';

const ServerConfig = z.object({
  openai: z.object({
    apiEndpoint: z.string(),
    apiKey: z.string(),
  }),
  googleai: z.object({
    model: z.string(),
    apiKey: z.string(),
  }),
  google: z.object({
    clientId: z.string(),
    clientSecret: z.string(),
  }),
});

type ServerConfig = z.infer<typeof ServerConfig>;

export const serverConfig: ServerConfig = ServerConfig.parse({
  openai: {
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: process.env.OPENAI_API_KEY,
  },
  googleai: {
    model: 'gemini-2.0-flash',
    apiKey: process.env.GOOGLE_AI_API_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
  },
});
