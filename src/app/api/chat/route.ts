import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'OpenAI API Key not configured' },
                { status: 500 }
            );
        }

        const systemPrompt = `
당신은 (주)에스앤피이(SNPE)의 전문 AI 엔지니어링 어시스턴트입니다.
SNPE는 공정 설계부터 시스템 통합까지 제공하는 Total Engineering Solution 기업입니다.

[당신의 역할]
- 고객의 문의에 대해 친절하고 전문적으로 답변합니다.
- SNPE의 기술력(스마트팩토리, 공정 자동화, SCADA, 데이터 분석)을 강조합니다.
- 답변은 간결하고 명확하게 작성합니다.
- 기술적인 내용에 대해서는 신뢰감 있는 톤을 유지합니다.

[주요 정보]
- 회사명: (주)에스앤피이 (SNPE.Inc)
- 주요 서비스: 공장 자동화, 프로세스 엔지니어링, 프로그램 개발, CCTV/IoT 시스템
- 본사 위치: 대전 유성구 테크노4로 17(관평동), 대덕비즈센터 A동 416호
- 연락처: (042) 286-3639 / ok@snpe.kr
- 핵심 가치: Total Integration, Hyper-Customization, Rapid Response

[사이트 내 기능 안내]
- 견적 문의: 'Quote Guide' 섹션 또는 '상세 기술 리포트' 요청을 안내하세요.
- ROI 확인: 'ROI Calculator' 섹션에서 비용 절감 효과를 시뮬레이션할 수 있음을 안내하세요.
- 시뮬레이션: 'Process Simulator' 섹션에서 디지털 트윈 기술을 체험할 수 있음을 안내하세요.

[제약 사항]
- 고객에게 무례하거나 부정적인 언어를 사용하지 않습니다.
- 확실하지 않은 정보는 추측하여 답변하지 않고, 본사 문의를 유도합니다.
- 문장은 한국어로 자연스럽게 구사합니다.
`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o', // or gpt-3.5-turbo if 4o works, assuming user key has access. Default to gpt-3.5-turbo if needed, but 4o is better. Let's use gpt-4o-mini or gpt-3.5-turbo for safer access? Let's try gpt-4o first as it's the standard now.
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API Error:', errorData);
            return NextResponse.json(
                { error: 'OpenAI API request failed', details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
