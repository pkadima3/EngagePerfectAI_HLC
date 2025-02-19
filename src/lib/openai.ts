import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateCaptions(params: {
  platform: string;
  niche: string;
  tone: string;
  goal: string;
  mediaType?: string;
}) {
  const { platform, niche, tone, goal, mediaType } = params;

  const prompt = `Create 3 engaging ${tone} captions for ${platform} in the ${niche} industry.

Format each caption as a JSON object with these fields:
- title: A brief description of the caption
- caption: The main caption text
- hashtags: Exactly 5 relevant hashtags for ${niche}
- cta: A call-to-action related to ${goal}

${goal === 'share_knowledge' ? 'Start each caption with "Did you know?", "Insight:", or "Fact:"' : ''}

Return a JSON object with a "captions" array containing exactly 3 caption objects.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a social media caption generator. Always respond with a JSON object containing a "captions" array with exactly 3 caption objects.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(response);
    
    if (!parsedResponse.captions || !Array.isArray(parsedResponse.captions)) {
      throw new Error('Invalid response format');
    }

    return parsedResponse.captions;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}