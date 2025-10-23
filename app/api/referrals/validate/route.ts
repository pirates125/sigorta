import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidReferralCodeFormat } from "@/lib/referral-generator";
import { z } from "zod";

const validateSchema = z.object({
  referralCode: z.string().min(1, "Referans kodu gerekli"),
});

/**
 * POST - Referans kodunu doğrula
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { referralCode } = validateSchema.parse(body);

    // Format kontrolü
    if (!isValidReferralCodeFormat(referralCode)) {
      return NextResponse.json(
        { valid: false, message: "Geçersiz referans kodu formatı" },
        { status: 400 }
      );
    }

    // Veritabanında kontrol et
    const user = await prisma.user.findUnique({
      where: { referralCode },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        valid: false,
        message: "Referans kodu bulunamadı",
      });
    }

    return NextResponse.json({
      valid: true,
      referrer: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { valid: false, message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Validate referral error:", error);
    return NextResponse.json(
      { valid: false, message: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
