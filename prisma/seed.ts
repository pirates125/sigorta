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

  // Broker kullanıcı oluştur
  const brokerPassword = await bcrypt.hash("broker123", 10);
  const broker = await prisma.user.upsert({
    where: { email: "broker@sigorta.com" },
    update: {},
    create: {
      email: "broker@sigorta.com",
      name: "Broker Ahmet",
      password: brokerPassword,
      role: "BROKER",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Broker kullanıcı oluşturuldu:", broker.email);

  // Sigorta şirketleri oluştur
  const companies = [
    {
      name: "Sompo Sigorta",
      code: "SOMPO",
      website: "https://www.somposigorta.com.tr",
      logo: null,
      rating: 4.2,
      coverageScore: 85,
      avgResponseTime: 3500,
      scraperEnabled: true,
      hasApi: true,
    },
    {
      name: "Anadolu Sigorta",
      code: "ANADOLU",
      website: "https://www.anadolusigorta.com.tr",
      logo: null,
      rating: 4.5,
      coverageScore: 90,
      avgResponseTime: 2800,
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "Ak Sigorta",
      code: "AK",
      website: "https://www.aksigorta.com.tr",
      logo: null,
      rating: 4.3,
      coverageScore: 88,
      avgResponseTime: 3200,
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "AXA Sigorta",
      code: "AXA",
      website: "https://www.axa.com.tr",
      logo: null,
      rating: 4.4,
      coverageScore: 87,
      avgResponseTime: 3100,
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "Allianz Sigorta",
      code: "ALLIANZ",
      website: "https://www.allianz.com.tr",
      logo: null,
      rating: 4.6,
      coverageScore: 92,
      avgResponseTime: 2500,
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "HDI Sigorta",
      code: "HDI",
      website: "https://www.hdi.com.tr",
      logo: null,
      rating: 4.1,
      coverageScore: 84,
      avgResponseTime: 3400,
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "Quick Sigorta",
      code: "QUICK",
      website: "https://www.quicksigorta.com",
      logo: null,
      rating: 4.0,
      coverageScore: 82,
      avgResponseTime: 2200,
      scraperEnabled: true,
      hasApi: false,
    },
    {
      name: "Güneş Sigorta",
      code: "GUNES",
      website: "https://www.gunessigorta.com.tr",
      logo: null,
      rating: 4.3,
      coverageScore: 86,
      avgResponseTime: 3000,
      scraperEnabled: false,
      hasApi: false,
    },
    {
      name: "Mapfre Sigorta",
      code: "MAPFRE",
      website: "https://www.mapfresigorta.com.tr",
      logo: null,
      rating: 4.2,
      coverageScore: 85,
      avgResponseTime: 3300,
      scraperEnabled: false,
      hasApi: false,
    },
    {
      name: "Türk Nippon Sigorta",
      code: "TURKNIPPON",
      website: "https://www.turknippon.com",
      logo: null,
      rating: 4.1,
      coverageScore: 83,
      avgResponseTime: 3600,
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
