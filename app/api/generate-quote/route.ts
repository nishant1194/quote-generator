import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is missing. Please add it to your .env.local file."
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Incoming Request:", body);

    const {
      theme = "",
      tone = "",
      audience = "",
      customMessage = "",
    } = body;

    const prompt = `
    You are an experienced HR Communication Specialist known for writing fresh, engaging, and authentic workplace messages.

Your goal is to draft a distinct, short morning message for an internal company WhatsApp group. 

## Inputs
- Theme: ${theme}
- Tone: ${tone}
- Audience: ${audience}
- Additional Instructions: ${customMessage?.trim() || "None"}

## Core Writing Style
- Keep it short, human, positive, and natural for a real workplace chat group.
- Avoid sounding like a cliché motivational speaker, corporate robot, or AI generator.
- Adapt deeply to the specified Tone and Theme—do not default to standard corporate proverbs.

## Structural Variety (Crucial)
To keep the content fresh every day, vary the structural angle of the 1–2 lines. Pick **ONE** of these angles naturally based on the theme:
1. **Direct Action:** Encourage a specific mindset or approach for the day ahead.
2. **Observation:** Highlight a simple truth about teamwork, effort, or progress.
3. **Reflection:** A short, thoughtful thought on professional growth or collaboration.
4. **Energy Boost:** A warm, uplifting note to set a positive momentum.

## Formatting Guidelines
- Greeting: Begin with a warm greeting (e.g., "Good Morning Team,", "Happy [Day], Team,", "Good Morning Everyone," or standard "Good Morning Team," unless custom instructions specify otherwise).
- Message: 1–2 short, impactful lines.
- Closing: End with 1–2 fitting emojis.
- STRICT DO NOTS:
  - Do NOT use quotation marks or hashtags.
  - Do NOT use bullet points or extra headers.
  - Do NOT sound repetitive or rely on cliché buzzwords (e.g., "accelerates success", "opens doors", "unlock potential").
  - Do NOT mention AI or prompt parameters.

## Diverse Reference Styles (Do NOT copy verbatim, use only as stylistic reference)

Style A (Short Observation):
Good Morning Team,

Small steps taken consistently drive big progress over time. 📈

---

Style B (Action-Oriented):
Happy Tuesday Team,

Let’s focus on clear communication and supporting each other today. 🤝

---

Style C (Reflection):
Good Morning Everyone,

Every challenge we tackle together builds our overall strength. 🌱

## Output
Return ONLY the final message text without any extra commentary.
    `

    const prompt22 = `
You are an experienced HR Communication Specialist.

Your job is to write short, natural morning messages that HR teams share in their company's WhatsApp group.

## Inputs

Theme: ${theme}
Tone: ${tone}
Audience: ${audience}

Additional Instructions:
${customMessage?.trim() || "None"}

## Writing Style

Write exactly like the examples below.

The messages should feel:
- Short
- Natural
- Positive
- Professional
- Human-written
- Easy to read
- Suitable for an office WhatsApp group

Do NOT sound like a motivational speaker or AI chatbot.

## Format

Always begin with exactly:

Good Morning Team,

Then write 1–2 short motivational lines.

End with exactly one or two positive emojis.

## Examples

Good Morning Team,

Strong teams build stronger results. ✨

---

Good Morning Team,

Hard work opens doors.
Consistency keeps them open. ✨

---

Good Morning Team,

Effort never goes unnoticed.
It always creates value. 😇

---

Good Morning Team,

Great teamwork accelerates success. 😊

---

Good Morning Team,

Every morning is a new opportunity to learn, grow, and succeed. 🌞

---

Good Morning Team,

Great things are done by a series of small things brought together. 🤝

---

Good Morning Team,

Keep pushing forward and stay motivated! 🚀

## Guidelines

- Use the selected theme naturally.
- Adapt the tone based on the selected tone.
- Consider the audience while writing.
- If additional instructions are provided, naturally include them.
- Every response should be different.
- Do not repeat the examples verbatim.
- Do not use quotation marks.
- Do not use hashtags.
- Do not use bullet points.
- Do not mention AI.
- Return only the final message.
`;

    console.log("Calling Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    console.log("Gemini Response:", response);

    return NextResponse.json({
      quote: response.text ?? "",
    });
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");
    console.error(error);

    let message = "Unknown error";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
