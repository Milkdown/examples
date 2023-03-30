import type { Handler } from 'vite-plugin-mix'
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAPI_KEY,
});
const openai = new OpenAIApi(configuration);

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
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          n: 1,
        });
        const hint = completion.data.choices[0]!.text;
        return res.end(JSON.stringify({ hint }))
    }
    next()
    return;
}
