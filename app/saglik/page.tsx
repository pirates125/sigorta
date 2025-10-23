import Link from "next/link";
import { Shield, User, Users, ArrowLeft, Bell, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata = {
  title: "Sağlık Sigortası - Çok Yakında | Sigorta Acentesi",
  description: "Sağlık sigortası karşılaştırma hizmeti çok yakında sizlerle!",
};

export default async function SaglikComingSoonPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold">
              <span className="hidden sm:inline">Sigorta Acentesi</span>
              <span className="sm:hidden">Sigorta</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  Hoş geldiniz, {session.user.name}
                </span>
                <Link href="/referrals">
                  <Button variant="outline" size="sm" className="hidden md:flex">
                    <Users className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">Arkadaş Davet</span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 md:mr-2" />
                    <span className="hidden sm:inline">Panelim</span>
                  </Button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Giriş</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Kayıt Ol</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ana Sayfaya Dön
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Sağlık Sigortası
            </h1>
            <p className="text-xl text-muted-foreground">
              Çok Yakında Sizlerle!
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Neler Sunacağız?</CardTitle>
              <CardDescription>
                Sağlık sigortası karşılaştırma hizmetimiz çok yakında aktif olacak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium">Bireysel & Aile Paketleri</p>
                  <p className="text-sm text-muted-foreground">
                    Kendiniz için veya tüm aileniz için en uygun sağlık sigortası paketlerini karşılaştırın
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium">Yaş ve İhtiyaç Bazlı Fiyatlandırma</p>
                  <p className="text-sm text-muted-foreground">
                    Yaşınıza ve sağlık ihtiyaçlarınıza özel teminat ve fiyat seçenekleri
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium">Kapsamlı Hastane Ağları</p>
                  <p className="text-sm text-muted-foreground">
                    Anlaşmalı hastane ve klinik ağlarını detaylıca inceleyin
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium">Tamamlayıcı Sağlık Sigortası</p>
                  <p className="text-sm text-muted-foreground">
                    SGK'nın karşılamadığı masraflar için tamamlayıcı sigorta seçenekleri
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Haber Vermemizi İster misiniz?</CardTitle>
              </div>
              <CardDescription>
                Sağlık sigortası hizmeti hazır olduğunda size email gönderelim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email adresiniz"
                  className="flex-1"
                />
                <Button>Bildir</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Sadece hizmet aktif olduğunda bilgilendirme yapacağız
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Şimdilik trafik sigortası hizmetimizden faydalanabilirsiniz
            </p>
            <Link href="/trafik">
              <Button size="lg">
                Trafik Sigortası Teklifi Al
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

