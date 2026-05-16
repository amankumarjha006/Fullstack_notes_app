import { AI_SYSTEM_PROMPT } from "./prompts";

export async function generateNoteInsights(content) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: AI_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Here is the note content to analyze:\n\n${content}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      stream: false,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Groq API error:", err);
    throw new Error("Failed to communicate with Groq API.");
  }

  const data = await response.json();
  const rawContent = data.choices[0]?.message?.content;

  if (!rawContent) {
    throw new Error("Empty response from AI.");
  }

  // Attempt to parse the JSON.
  // Models sometimes wrap JSON in markdown blocks despite instructions.
  try {
    const cleaned = rawContent.replace(/```json\n?/, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Failed to parse JSON from AI response:", rawContent);
    throw new Error("AI returned invalid data format.");
  }
}
