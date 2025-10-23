import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  sendPolicyConfirmationEmail,
  sendCommissionNotificationEmail,
} from "@/lib/email";

const createPolicySchema = z.object({
  quoteResponseId: z.string().cuid(),
  paymentMethod: z.string().optional(),
});

/**
 * POST - Poliçe oluştur
 */
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { quoteResponseId } = createPolicySchema.parse(body);

    // Quote response'u al
    const quoteResponse = await prisma.quoteResponse.findUnique({
      where: { id: quoteResponseId },
      include: {
        quote: true,
        company: true,
      },
    });

    if (!quoteResponse) {
      return NextResponse.json(
        { message: "Teklif bulunamadı" },
        { status: 404 }
      );
    }

    // Poliçe oluştur
    const policy = await prisma.policy.create({
      data: {
        userId: session.user.id,
        quoteId: quoteResponse.quoteId,
        companyId: quoteResponse.companyId,
        insuranceType: quoteResponse.quote.insuranceType,
        premium: quoteResponse.price,
        status: "PENDING",
        policyData: quoteResponse.quote.formData as any,
      },
    });

    // Kullanıcı bilgilerini al (email için)
    const policyUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    });

    // Referans sistemi - komisyon oluştur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { referredBy: true },
    });

    if (user?.referredBy) {
      // Referans kaydını kontrol et
      const referral = await prisma.referral.findFirst({
        where: {
          referrerId: user.referredBy,
          referredUserId: session.user.id,
          status: "PENDING",
        },
      });

      if (referral) {
        // İlk poliçe mi kontrol et
        const isFirstPolicy = await prisma.policy.count({
          where: {
            userId: session.user.id,
          },
        });

        if (isFirstPolicy === 1) {
          // İlk poliçe! Komisyon oluştur
          const commissionAmount =
            (Number(quoteResponse.price) * Number(referral.commissionRate)) /
            100;

          await prisma.commission.create({
            data: {
              userId: user.referredBy,
              referralId: referral.id,
              policyId: policy.id,
              amount: commissionAmount,
              status: "PENDING",
            },
          });

          // Referral'ı tamamlandı olarak işaretle
          await prisma.referral.update({
            where: { id: referral.id },
            data: {
              status: "COMPLETED",
              firstPolicyId: policy.id,
              completedAt: new Date(),
            },
          });

          // Broker'a komisyon bildirimi gönder
          const broker = await prisma.user.findUnique({
            where: { id: user.referredBy },
            select: { name: true, email: true },
          });

          if (broker) {
            try {
              await sendCommissionNotificationEmail({
                to: broker.email,
                name: broker.name || "Değerli Broker",
                amount: commissionAmount,
                customerName: policyUser?.name || "Müşteri",
                policyNumber: policy.policyNumber || policy.id,
              });
            } catch (emailError) {
              console.error("Commission email error:", emailError);
            }
          }
        }
      }
    }

    // Poliçe onay email'i gönder
    if (policyUser) {
      try {
        await sendPolicyConfirmationEmail({
          to: policyUser.email,
          name: policyUser.name || "Değerli Müşteri",
          policyNumber: policy.policyNumber || policy.id,
          companyName: quoteResponse.company.name,
          insuranceType: policy.insuranceType,
          premium: Number(policy.premium),
        });
      } catch (emailError) {
        console.error("Policy confirmation email error:", emailError);
      }
    }

    return NextResponse.json(
      {
        message: "Poliçe başarıyla oluşturuldu",
        policy: {
          id: policy.id,
          policyNumber: policy.policyNumber,
          premium: Number(policy.premium),
          status: policy.status,
        },
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

    console.error("Create policy error:", error);
    return NextResponse.json(
      { message: "Poliçe oluşturulamadı" },
      { status: 500 }
    );
  }
}

/**
 * GET - Kullanıcının poliçelerini al
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

    const policies = await prisma.policy.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
        quote: {
          select: {
            insuranceType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(policies);
  } catch (error) {
    console.error("Get policies error:", error);
    return NextResponse.json(
      { message: "Poliçeler alınamadı" },
      { status: 500 }
    );
  }
}
