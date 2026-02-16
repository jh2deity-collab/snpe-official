import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { company, name, phone, content } = await req.json();

        // Validation
        if (!name || !phone || !content) {
            return NextResponse.json(
                { message: "필수 정보를 모두 입력해 주세요." },
                { status: 400 }
            );
        }

        // 환경 변수가 없거나 플레이스홀더 버전인 경우 실제 발송 건너뜀 (테스트/개발용)
        const isEmailConfigured =
            process.env.EMAIL_USER &&
            process.env.EMAIL_PASS &&
            process.env.EMAIL_PASS !== "your-app-password";

        if (!isEmailConfigured) {
            console.log("Email Config missing or placeholder - Logging content instead:");
            console.log(`To: ok@snpe.kr\nSubject: [SNPE 웹사이트 문의] ${company || "개인"} - ${name}님\nBody: ${content}`);

            return NextResponse.json(
                { message: "상담 신청이 접수되었습니다. (개발 모드: 로그 기록됨)" },
                { status: 200 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const isGuideRequest = content.includes("[지능형 견적 신청]");
        const isROIRequest = content.includes("[ROI 리포트 다운로드 알림]");
        const category = isGuideRequest ? "가이드 리포트" : isROIRequest ? "ROI 리포트" : "일반 상담";

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "ok@snpe.kr",
            subject: `[SNPE ${category}] ${company || "개인"} - ${name}님`,
            text: `
        회사명: ${company || "미입력"}
        성함: ${name}
        연락처: ${phone}
        
        내용:
        ${content}
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "상담 신청이 성공적으로 접수되었습니다." },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Email API Error:", error);

        // 구체적인 에러 메시지 반환 (보안상 운영 환경에서는 가리는 것이 좋으나 디버깅을 위해 추가)
        if (error.responseCode === 535) {
            return NextResponse.json(
                { message: "이메일 인증에 실패했습니다. (앱 비밀번호를 다시 확인해 주세요)" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "서버 오류로 인해 전송에 실패했습니다." },
            { status: 500 }
        );
    }
}
