import { env } from "./env";

interface Message {
    role: "system" | "user";
    content: string;
}

export const OpenAi = async ({
    messages,
    max_tokens,
    temperature,
}: {
    messages: Message[];
    max_tokens: number;
    temperature: number;
}) => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: max_tokens,
            temperature: temperature,
        }),
    });

    if (!response.ok) {
        const errMsg = await response.text();

        throw new Error(`Category check API error: ${errMsg}`);
    }

    return await response.json();
};
