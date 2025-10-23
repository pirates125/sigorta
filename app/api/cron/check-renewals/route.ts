import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateRenewalStatus,
  getDaysUntilExpiry,
  shouldSendReminder,
} from "@/lib/renewal-utils";
import { sendRenewalReminderEmail } from "@/lib/email";

/**
 * GET - Cron job: Poliçe vadelerini kontrol et ve hatırlatma gönder
 * Günlük çalıştırılmalı (örn: Vercel Cron Jobs, GitHub Actions)
 */
export async function GET(req: Request) {
  try {
    // Basit güvenlik kontrolü (production'da daha güçlü olmalı)
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("🔄 Renewal check cron job başladı...");

    // Aktif ve endDate'i olan tüm poliçeleri al
    const policies = await prisma.policy.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          not: null,
        },
      },
      include: {
        user: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`📊 ${policies.length} aktif poliçe bulundu`);

    let remindersSent = 0;
    let statusUpdates = 0;

    for (const policy of policies) {
      if (!policy.endDate) continue;

      const renewalStatus = calculateRenewalStatus(policy.endDate);
      const daysLeft = getDaysUntilExpiry(policy.endDate);

      // Renewal status güncelle
      if (policy.renewalStatus !== renewalStatus) {
        await prisma.policy.update({
          where: { id: policy.id },
          data: { renewalStatus },
        });
        statusUpdates++;
      }

      // Hatırlatma gönder
      if (
        shouldSendReminder(
          policy.endDate,
          policy.renewalReminded,
          renewalStatus
        )
      ) {
        try {
          await sendRenewalReminderEmail({
            to: policy.user.email!,
            name: policy.user.name || "Değerli Müşterimiz",
            policyNumber: policy.policyNumber || "Bekleniyor",
            insuranceType: policy.insuranceType,
            companyName: policy.company.name,
            endDate: policy.endDate,
            daysLeft: daysLeft || 0,
            premium: Number(policy.premium),
          });

          // Hatırlatma gönderildi olarak işaretle
          await prisma.policy.update({
            where: { id: policy.id },
            data: { renewalReminded: true },
          });

          remindersSent++;
          console.log(
            `✉️ Hatırlatma gönderildi: ${policy.user.email} - ${policy.policyNumber}`
          );
        } catch (emailError) {
          console.error(`❌ Email gönderme hatası (${policy.id}):`, emailError);
        }
      }
    }

    console.log(
      `✅ Cron job tamamlandı: ${statusUpdates} durum güncellendi, ${remindersSent} hatırlatma gönderildi`
    );

    return NextResponse.json({
      success: true,
      message: "Renewal check completed",
      stats: {
        totalPolicies: policies.length,
        statusUpdates,
        remindersSent,
      },
    });
  } catch (error) {
    console.error("❌ Renewal check cron error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Renewal check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
