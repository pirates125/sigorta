import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateReferralCode,
  generateReferralUrl,
} from "@/lib/referral-generator";

/**
 * GET - Kullanıcının referans kodunu al veya oluştur
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Kullanıcıyı al
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        referralCode: true,
      },
    });

    // Eğer referans kodu yoksa oluştur
    if (!user?.referralCode) {
      let referralCode: string;
      let isUnique = false;

      // Benzersiz kod oluştur
      do {
        referralCode = generateReferralCode();
        const existing = await prisma.user.findUnique({
          where: { referralCode },
        });
        isUnique = !existing;
      } while (!isUnique);

      // Kullanıcıyı güncelle
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { referralCode },
        select: {
          referralCode: true,
        },
      });
    }

    // URL oluştur
    const referralUrl = generateReferralUrl(user.referralCode!);

    return NextResponse.json({
      referralCode: user.referralCode,
      referralUrl,
    });
  } catch (error) {
    console.error("Generate referral error:", error);
    return NextResponse.json(
      { message: "Referans kodu oluşturulamadı" },
      { status: 500 }
    );
  }
}
