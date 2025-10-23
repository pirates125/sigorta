import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Veritabanı seed başlıyor...");

  // Admin kullanıcı oluştur
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sigorta.com" },
    update: {},
    create: {
      email: "admin@sigorta.com",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin kullanıcı oluşturuldu:", admin.email);

  // Test kullanıcı oluştur
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test Kullanıcı",
      password: userPassword,
      role: "USER",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Test kullanıcı oluşturuldu:", user.email);

  // Sigorta şirketleri oluştur
  const companies = [
    {
      name: "Sompo Sigorta",
      code: "SOMPO",
      website: "https://www.somposigorta.com.tr",
      scraperEnabled: true,
      hasApi: true,
    },
    {
      name: "Anadolu Sigorta",
      code: "ANADOLU",
      website: "https://www.anadolusigorta.com.tr",
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "Ak Sigorta",
      code: "AK",
      website: "https://www.aksigorta.com.tr",
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "Allianz Sigorta",
      code: "ALLIANZ",
      website: "https://www.allianz.com.tr",
      scraperEnabled: false,
      hasApi: false,
    },
    {
      name: "HDI Sigorta",
      code: "HDI",
      website: "https://www.hdi.com.tr",
      scraperEnabled: false,
      hasApi: false,
    },
    {
      name: "Güneş Sigorta",
      code: "GUNES",
      website: "https://www.gunessigorta.com.tr",
      scraperEnabled: false,
      hasApi: false,
    },
    {
      name: "Mapfre Sigorta",
      code: "MAPFRE",
      website: "https://www.mapfresigorta.com.tr",
      scraperEnabled: false,
      hasApi: false,
    },
    {
      name: "Türk Nippon Sigorta",
      code: "TURKNIPPON",
      website: "https://www.turknippon.com",
      scraperEnabled: false,
      hasApi: false,
    },
  ];

  for (const company of companies) {
    const created = await prisma.insuranceCompany.upsert({
      where: { code: company.code },
      update: {},
      create: company,
    });
    console.log("✅ Sigorta şirketi oluşturuldu:", created.name);
  }

  console.log("🎉 Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error("❌ Seed hatası:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
