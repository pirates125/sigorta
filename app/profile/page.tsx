"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ThemeColorPicker } from "@/components/ThemeColorPicker";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await response.json();
        setSession(data);
      } catch (error) {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold">
              <span className="hidden sm:inline">Sigorta Acentesi</span>
              <span className="sm:hidden">Sigorta</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/referrals">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Users className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Arkadaş Davet</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Bilgilerim</CardTitle>
              <CardDescription>
                Hesap bilgilerinizi güncelleyebilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialName={session.name || ""}
                initialEmail={session.email || ""}
              />
            </CardContent>
          </Card>

          {/* Theme Color Picker */}
          <ThemeColorPicker />
        </div>
      </div>
    </div>
  );
}
