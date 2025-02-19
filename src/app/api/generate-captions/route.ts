import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use private env variable here
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { platform, niche, tone, goal, mediaType, mediaContext } = body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: `Generate captions for ${platform} in the ${niche} niche with a ${tone} tone...`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate captions' },
      { status: 500 }
    );
  }
}