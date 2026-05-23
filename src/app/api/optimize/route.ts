import { NextResponse } from "next/server";
import { aiPrompts, generateSummary, strengthenBullet } from "@/lib/cv/optimization";

export async function POST(request: Request) {
  const body = await request.json();

  if (!process.env.OPENAI_API_KEY) {
    const content = body.type === "summary" ? generateSummary(body.data) : strengthenBullet(String(body.text ?? ""));
    return NextResponse.json({ content, mode: "deterministic" });
  }

  const prompt = aiPrompts[body.type as keyof typeof aiPrompts] ?? aiPrompts.bullet;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: JSON.stringify(body.data ?? body.text).slice(0, 12000) },
      ],
    }),
  });

  if (!response.ok) {
    const content = body.type === "summary" ? generateSummary(body.data) : strengthenBullet(String(body.text ?? ""));
    return NextResponse.json({ content, mode: "deterministic" });
  }

  const json = await response.json();
  return NextResponse.json({ content: json.choices?.[0]?.message?.content ?? "", mode: "ai" });
}
