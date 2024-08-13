import type { Handler } from 'vite-plugin-mix'
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAPI_KEY,
});

export const handler: Handler = async (req, res, next) => {
    if (req.path === '/api' && req.method === "POST") {
        const buffers = [];

        for await (const chunk of req) {
          buffers.push(chunk);
        }

        const data = Buffer.concat(buffers).toString();
        const body = JSON.parse(data)
        const { prompt } = body;
        if (!prompt) {
          return res.end(JSON.stringify({ message: 'Invalid Request' }))
        }
        const completion = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: 'user', content: prompt }],
          n: 1,
        });
        const hint = completion.choices[0]!.message!.content;
        return res.end(JSON.stringify({ hint }))
    }
    next()
    return;
}
