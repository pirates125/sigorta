import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateReferralCode } from "@/lib/referral-generator";
import { sendWelcomeEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  referralCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    // Email kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu email adresi zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Referans kodu kontrolü
    let referrerId: string | undefined;
    if (validatedData.referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: validatedData.referralCode },
        select: { id: true },
      });

      if (!referrer) {
        return NextResponse.json(
          { message: "Geçersiz referans kodu" },
          { status: 400 }
        );
      }

      referrerId = referrer.id;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Benzersiz referans kodu oluştur
    let userReferralCode: string;
    let isUnique = false;
    do {
      userReferralCode = generateReferralCode();
      const existing = await prisma.user.findUnique({
        where: { referralCode: userReferralCode },
      });
      isUnique = !existing;
    } while (!isUnique);

    // Kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "USER",
        referralCode: userReferralCode,
        referredBy: referrerId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    });

    // Eğer referans ile kaydolduysa, Referral kaydı oluştur
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredUserId: user.id,
          referralCode: validatedData.referralCode!,
          status: "PENDING", // İlk poliçe alınca COMPLETED olacak
        },
      });
    }

    // Hoşgeldin email'i gönder
    try {
      await sendWelcomeEmail({
        to: user.email,
        name: user.name || "Değerli Kullanıcı",
      });
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
      // Email hatası kullanıcı kaydını etkilemez
    }

    return NextResponse.json(
      {
        message: "Kayıt başarılı",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Register error:", error);
    return NextResponse.json({ message: "Bir hata oluştu" }, { status: 500 });
  }
}
