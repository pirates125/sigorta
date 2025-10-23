import nodemailer from "nodemailer";

// Email transporter oluştur
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Email gönderme fonksiyonu
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Sigorta Acentesi" <${
        process.env.SMTP_FROM || "noreply@sigorta.com"
      }>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// Hoşgeldin email'i
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Hoş Geldiniz!</h1>
        </div>
        <div class="content">
          <p>Merhaba <strong>${name}</strong>,</p>
          <p>Sigorta Acentesi'ne hoş geldiniz! Kaydınız başarıyla tamamlandı.</p>
          <p>Artık platformumuzda:</p>
          <ul>
            <li>✓ Tüm sigorta şirketlerinden anında fiyat alabilirsiniz</li>
            <li>✓ Akıllı karşılaştırma algoritması ile en uygun teklifi bulabilirsiniz</li>
            <li>✓ Online olarak poliçe satın alabilirsiniz</li>
            <li>✓ Arkadaşlarınızı davet ederek komisyon kazanabilirsiniz</li>
          </ul>
          <p>Hemen teklif almaya başlayın:</p>
          <a href="${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/dashboard" class="button">
            Dashboard'a Git
          </a>
          <p style="margin-top: 30px;">
            Sorularınız için bize her zaman <a href="mailto:info@sigorta.com">info@sigorta.com</a> adresinden ulaşabilirsiniz.
          </p>
        </div>
        <div class="footer">
          <p>Bu email Sigorta Acentesi tarafından gönderilmiştir.</p>
          <p>&copy; 2025 Sigorta Acentesi. Tüm hakları saklıdır.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: "Sigorta Acentesi'ne Hoş Geldiniz! 🎉",
    html,
    text: `Merhaba ${name}, Sigorta Acentesi'ne hoş geldiniz! Kaydınız başarıyla tamamlandı.`,
  });
}

// Teklif hazır email'i
export async function sendQuoteReadyEmail({
  to,
  name,
  quoteId,
  insuranceType,
  responseCount,
  bestPrice,
}: {
  to: string;
  name: string;
  quoteId: string;
  insuranceType: string;
  responseCount: number;
  bestPrice: number;
}) {
  const insuranceTypeLabels: Record<string, string> = {
    TRAFFIC: "Trafik Sigortası",
    KASKO: "Kasko Sigortası",
    DASK: "DASK Sigortası",
    HEALTH: "Sağlık Sigortası",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 10px 10px;
          }
          .highlight-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          .price {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Teklifleriniz Hazır!</h1>
        </div>
        <div class="content">
          <p>Merhaba <strong>${name}</strong>,</p>
          <p>${insuranceTypeLabels[insuranceType]} için teklifleriniz hazır!</p>
          
          <div class="highlight-box">
            <p style="margin: 0; color: #666;">En İyi Fiyat</p>
            <div class="price">${new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
            }).format(bestPrice)}</div>
            <p style="margin: 0; color: #666;"><strong>${responseCount}</strong> sigorta şirketinden teklif aldık</p>
          </div>

          <p>Tekliflerinizi incelemek ve karşılaştırmak için:</p>
          <a href="${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/quotes/${quoteId}" class="button">
            Teklifleri Görüntüle
          </a>

          <p style="margin-top: 30px;">
            Akıllı karşılaştırma algoritmamız sadece fiyata değil, kapsama ve şirket güvenilirliğine de bakarak size en uygun teklifi öneriyor.
          </p>
        </div>
        <div class="footer">
          <p>Bu email Sigorta Acentesi tarafından gönderilmiştir.</p>
          <p>&copy; 2025 Sigorta Acentesi. Tüm hakları saklıdır.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `${insuranceTypeLabels[insuranceType]} Teklifleriniz Hazır! ✅`,
    html,
    text: `Merhaba ${name}, ${insuranceTypeLabels[insuranceType]} teklifleriniz hazır! ${responseCount} şirketten teklif aldık. En iyi fiyat: ${bestPrice} TL`,
  });
}

// Poliçe onay email'i
export async function sendPolicyConfirmationEmail({
  to,
  name,
  policyNumber,
  companyName,
  insuranceType,
  premium,
}: {
  to: string;
  name: string;
  policyNumber: string;
  companyName: string;
  insuranceType: string;
  premium: number;
}) {
  const insuranceTypeLabels: Record<string, string> = {
    TRAFFIC: "Trafik Sigortası",
    KASKO: "Kasko Sigortası",
    DASK: "DASK Sigortası",
    HEALTH: "Sağlık Sigortası",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 10px 10px;
          }
          .policy-box {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 2px solid #10b981;
          }
          .policy-number {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            font-family: monospace;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎊 Poliçeniz Oluşturuldu!</h1>
        </div>
        <div class="content">
          <p>Tebrikler <strong>${name}</strong>,</p>
          <p>Sigorta poliçeniz başarıyla oluşturuldu!</p>
          
          <div class="policy-box">
            <p style="margin: 0 0 10px 0; color: #666;">Poliçe Numarası</p>
            <div class="policy-number">${policyNumber}</div>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0;">Poliçe Detayları</h3>
            <div class="info-row">
              <span>Sigorta Şirketi:</span>
              <strong>${companyName}</strong>
            </div>
            <div class="info-row">
              <span>Sigorta Türü:</span>
              <strong>${insuranceTypeLabels[insuranceType]}</strong>
            </div>
            <div class="info-row">
              <span>Prim Tutarı:</span>
              <strong>${new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(premium)}</strong>
            </div>
          </div>

          <p style="margin-top: 20px;">
            Poliçeniz aktif durumda. Detaylı bilgi ve belgeleriniz için dashboard'unuzu ziyaret edebilirsiniz.
          </p>

          <a href="${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/dashboard" class="button">
            Poliçelerimi Görüntüle
          </a>

          <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <strong>💡 İpucu:</strong> Poliçenizi arkadaşlarınıza önererek komisyon kazanabilirsiniz!
          </p>
        </div>
        <div class="footer">
          <p>Bu email Sigorta Acentesi tarafından gönderilmiştir.</p>
          <p>&copy; 2025 Sigorta Acentesi. Tüm hakları saklıdır.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Poliçeniz Oluşturuldu - ${policyNumber} 🎊`,
    html,
    text: `Tebrikler ${name}, ${insuranceTypeLabels[insuranceType]} poliçeniz oluşturuldu! Poliçe No: ${policyNumber}`,
  });
}

// Vade hatırlatma email'i
export async function sendRenewalReminderEmail({
  to,
  name,
  policyNumber,
  insuranceType,
  companyName,
  endDate,
  daysLeft,
  premium,
}: {
  to: string;
  name: string;
  policyNumber: string;
  insuranceType: string;
  companyName: string;
  endDate: Date;
  daysLeft: number;
  premium: number;
}) {
  const insuranceTypeLabels: Record<string, string> = {
    TRAFFIC: "Trafik Sigortası",
    KASKO: "Kasko Sigortası",
    DASK: "DASK Sigortası",
    HEALTH: "Sağlık Sigortası",
  };

  const urgencyColor =
    daysLeft <= 7 ? "#ef4444" : daysLeft <= 15 ? "#f59e0b" : "#3b82f6";
  const urgencyText =
    daysLeft <= 7 ? "ACİL!" : daysLeft <= 15 ? "YAKINDA" : "HATIRLATMA";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, ${urgencyColor} 0%, ${urgencyColor}dd 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 10px 10px;
          }
          .days-left {
            background: ${urgencyColor}15;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid ${urgencyColor};
            text-align: center;
          }
          .days-number {
            font-size: 48px;
            font-weight: bold;
            color: ${urgencyColor};
            margin: 10px 0;
          }
          .info-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: ${urgencyColor};
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⏰ ${urgencyText}: Poliçe Yenileme Zamanı!</h1>
        </div>
        <div class="content">
          <p>Merhaba <strong>${name}</strong>,</p>
          <p>${
            insuranceTypeLabels[insuranceType]
          } poliçenizin süresi dolmak üzere!</p>
          
          <div class="days-left">
            <p style="margin: 0; color: ${urgencyColor}; font-weight: bold;">${urgencyText}</p>
            <div class="days-number">${daysLeft}</div>
            <p style="margin: 0;">GÜN KALDI</p>
          </div>

          <div class="info-box">
            <h3 style="margin-top: 0;">Poliçe Detayları</h3>
            <div class="info-row">
              <span>Poliçe No:</span>
              <strong>${policyNumber}</strong>
            </div>
            <div class="info-row">
              <span>Sigorta Şirketi:</span>
              <strong>${companyName}</strong>
            </div>
            <div class="info-row">
              <span>Sigorta Türü:</span>
              <strong>${insuranceTypeLabels[insuranceType]}</strong>
            </div>
            <div class="info-row">
              <span>Bitiş Tarihi:</span>
              <strong>${new Date(endDate).toLocaleDateString("tr-TR")}</strong>
            </div>
            <div class="info-row">
              <span>Mevcut Prim:</span>
              <strong>${new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(premium)}</strong>
            </div>
          </div>

          <p style="margin-top: 20px;">
            Poliçenizi yenilemek veya daha uygun fiyatları karşılaştırmak için:
          </p>

          <a href="${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/dashboard" class="button">
            Yenileme Teklifi Al
          </a>

          <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 5px; border-left: 4px solid #f59e0b;">
            <strong>💡 İpucu:</strong> Erken yenileme yaparak daha uygun fiyatlar bulabilir ve kesintisiz teminat sağlayabilirsiniz.
          </p>
        </div>
        <div class="footer">
          <p>Bu email Sigorta Acentesi tarafından gönderilmiştir.</p>
          <p>&copy; 2025 Sigorta Acentesi. Tüm hakları saklıdır.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `${urgencyText}: ${insuranceTypeLabels[insuranceType]} Poliçeniz ${daysLeft} Gün Sonra Dolacak! ⏰`,
    html,
    text: `Merhaba ${name}, ${insuranceTypeLabels[insuranceType]} poliçenizin (${policyNumber}) ${daysLeft} gün sonra süresi dolacak. Yenilemek için dashboard'unuzu ziyaret edin.`,
  });
}

// Broker komisyon bildirimi
export async function sendCommissionNotificationEmail({
  to,
  name,
  amount,
  customerName,
  policyNumber,
}: {
  to: string;
  name: string;
  amount: number;
  customerName: string;
  policyNumber: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 10px 10px;
          }
          .commission-box {
            background: #fffbeb;
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
            border: 2px solid #f59e0b;
            text-align: center;
          }
          .amount {
            font-size: 36px;
            font-weight: bold;
            color: #d97706;
            margin: 10px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #f59e0b;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💰 Yeni Komisyon Kazandınız!</h1>
        </div>
        <div class="content">
          <p>Harika haber <strong>${name}</strong>!</p>
          <p>Davet ettiğiniz müşterinin ilk poliçe satın alımı gerçekleşti!</p>
          
          <div class="commission-box">
            <p style="margin: 0; color: #92400e;">Kazanılan Komisyon</p>
            <div class="amount">${new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
            }).format(amount)}</div>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Müşteri:</strong> ${customerName}</p>
            <p style="margin: 10px 0 0 0;"><strong>Poliçe No:</strong> ${policyNumber}</p>
          </div>

          <p>Komisyonunuz onay sürecine alındı. Onaylandıktan sonra ödeme hesabınıza aktarılacak.</p>

          <a href="${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/broker/commissions" class="button">
            Komisyonlarımı Görüntüle
          </a>

          <p style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 5px; border-left: 4px solid #3b82f6;">
            <strong>💡 İpucu:</strong> Daha fazla müşteri davet ederek kazancınızı artırabilirsiniz!
          </p>
        </div>
        <div class="footer">
          <p>Bu email Sigorta Acentesi tarafından gönderilmiştir.</p>
          <p>&copy; 2025 Sigorta Acentesi. Tüm hakları saklıdır.</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Yeni Komisyon Kazandınız - ${new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount)} 💰`,
    html,
    text: `Harika haber ${name}! ${customerName} isimli müşteriniz poliçe satın aldı. Komisyon: ${amount} TL`,
  });
}
