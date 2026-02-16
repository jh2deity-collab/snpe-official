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
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "ok@snpe.kr",
            subject: `[SNPE 웹사이트 문의] ${company || "개인"} - ${name}님`,
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
    } catch (error) {
        console.error("Email API Error:", error);
        return NextResponse.json(
            { message: "서버 오류로 인해 전송에 실패했습니다." },
            { status: 500 }
        );
    }
}
