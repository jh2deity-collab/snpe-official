
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { industry, problem, voiceInput } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenAI API Key not configured' },
                { status: 500 }
            );
        }

        let messages;

        if (voiceInput) {
            // Voice Mode: Extract + Simulate
            const systemPrompt = `
You are an expert industrial engineer.
The user will provide a voice command describing a factory issue.
Your task:
1. Extract the "Industry" and "Problem" from the input.
2. If details are vague, infer the most likely industry and bottleneck.
3. Generate a "Before vs After" simulation scenario.

Output Format: JSON only.
{
  "extracted_info": {
    "industry": "String",
    "problem": "String"
  },
  "nodes": [
    { "id": 1, "label": "Step 1", "type": "input" },
    { "id": 2, "label": "Step 2", "type": "process" },
    { "id": 3, "label": "Step 3", "type": "ai_control" },
    { "id": 4, "label": "Step 4", "type": "output" }
  ],
  "metrics": {
    "efficiency": number (0-100),
    "throughput": number,
    "uptime": number (0-100)
  },
  "analysis": "A brief, 2-sentence technical explanation in Korean."
}

Rules:
- "nodes": OPTIMIZED process flow (4 nodes).
- "nodes" labels: Short (2-3 words).
`;
            messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Voice Input: "${voiceInput}"` }
            ];

        } else {
            // Text Mode: Direct Simulation
            const systemPrompt = `
You are an expert industrial engineer.
Analyze the user's input (Industry, Problem) and generate a simulation scenario.

Input:
- Industry: {industry}
- Problem: {problem}

Output Format: JSON only.
{
  "nodes": [ ...same structure... ],
  "metrics": { ...same structure... },
  "analysis": "A brief, 2-sentence technical explanation in Korean."
}

Rules:
- "nodes": OPTIMIZED process flow (4 nodes).
- "nodes" labels: Short (2-3 words).
`;
            messages = [
                { role: 'system', content: systemPrompt.replace('{industry}', industry).replace('{problem}', problem) },
                { role: 'user', content: `Industry: ${industry}, Problem: ${problem}` }
            ];
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: messages,
                temperature: 0.7,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'OpenAI API Error', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Simulation Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
