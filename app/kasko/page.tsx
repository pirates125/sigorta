import Link from "next/link";
import { Shield, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import KaskoInsuranceForm from "@/components/forms/KaskoInsuranceForm";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata = {
  title: "Kasko Sigortası Teklifi | Sigorta Acentesi",
  description:
    "Aracınız için Mini, Midi veya Maxi kasko paketi seçin. Tüm sigorta şirketlerinden anında fiyat karşılaştırması yapın.",
};

export default async function KaskoPage() {
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
                  <Button variant="ghost" size="sm">
                    Giriş
                  </Button>
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Kasko Sigortası Teklifi</h1>
            <p className="text-lg text-muted-foreground">
              Aracınızı kapsamlı bir şekilde koruyun. Mini, Midi veya Maxi paket
              seçin, tüm sigorta şirketlerinden anında fiyat alın.
            </p>
          </div>

          <KaskoInsuranceForm />

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Bilgileriniz güvende, sadece fiyat karşılaştırması için
              kullanılır.
            </p>
            <p className="mt-2">
              <span className="font-medium">Mini:</span> Temel koruma •{" "}
              <span className="font-medium">Midi:</span> Orta düzey koruma •{" "}
              <span className="font-medium">Maxi:</span> Tam koruma
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
