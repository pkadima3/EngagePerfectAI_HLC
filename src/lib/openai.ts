import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCaptions(params: {
  platform: string;
  niche: string;
  tone: string;
  goal: string;
  mediaType?: string;
}) {
  const { platform, niche, tone, goal, mediaType } = params;

  const prompt = `You are the world's best content creator and digital, Social Media marketing and sales expert with over 20 years of hands-on experience.

Create 3 highly engaging ${tone} captions for ${platform} for the ${niche} industry.

The captions must:
1. Be concise and tailored to ${platform}'s audience
2. Include 5 relevant hashtags for the ${niche} industry
3. Include a call-to-action to drive ${goal}
4. ${goal === 'share_knowledge' ? 'Start with phrases like "Did you know?" "Insight:" or "Fact:"' : ''}
5. Reflect current trends and platform-specific language

Format each caption as JSON with these fields:
- title: A catchy title
- caption: The main caption text
- hashtags: Array of 5 relevant hashtags
- cta: Call to action

Return exactly 3 captions in a JSON array.`;

  try {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Changed from "gpt-4-turbo-preview"
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response || '[]');
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}