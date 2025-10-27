import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Bu endpoint Vercel deployment sonrası migration çalıştırmak için
// Sadece production'da ve secret ile korunmalı
export async function POST(req: Request) {
  try {
    // Güvenlik kontrolü
    const authHeader = req.headers.get("authorization");
    const CRON_SECRET = process.env.CRON_SECRET;

    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Prisma client generate edilmiş mi kontrol et
    const testQuery = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      userCount: testQuery,
    });
  } catch (error: any) {
    console.error("Migration check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Database connection failed",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Basit health check
    await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      message: "Database is healthy",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Database connection failed",
      },
      { status: 500 }
    );
  }
}

