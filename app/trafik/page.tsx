import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrafficInsuranceForm from "@/components/forms/TrafficInsuranceForm";

export default function TrafficInsurancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Sigorta Acentesi</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">Panelim</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Trafik Sigortası Teklifi
            </h1>
            <p className="text-lg text-muted-foreground">
              Formu doldurun, tüm sigorta şirketlerinden anında fiyat alın
            </p>
          </div>

          <TrafficInsuranceForm />

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Bilgileriniz güvende, sadece fiyat karşılaştırması için
              kullanılır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
