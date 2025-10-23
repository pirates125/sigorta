import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
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
          <Link href="/">
            <Button variant="outline" size="sm">
              Ana Sayfa
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">İletişim</h1>
            <p className="text-xl text-muted-foreground">
              Bize ulaşın, size yardımcı olmaktan mutluluk duyarız
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Mail className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  <a
                    href="mailto:info@sigorta.com"
                    className="text-primary hover:underline"
                  >
                    info@sigorta.com
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  7/24 email desteği
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Telefon</CardTitle>
                <CardDescription>
                  <a
                    href="tel:08505551234"
                    className="text-primary hover:underline"
                  >
                    0850 555 12 34
                  </a>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hafta içi 09:00 - 18:00
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Adres</CardTitle>
                <CardDescription>İstanbul, Türkiye</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Merkez ofis</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sık Sorulan Sorular</CardTitle>
              <CardDescription>
                En çok sorulan sorular ve cevapları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">
                  Sigorta poliçem ne zaman başlar?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ödemenizi tamamladıktan sonra poliçeniz anında aktif hale
                  gelir.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Poliçemi iptal edebilir miyim?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Evet, poliçenizi istediğiniz zaman iptal edebilirsiniz. Kalan
                  süre için ücret iadesi yapılır.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Karşılaştırma ücretsiz mi?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Evet, tüm karşılaştırma ve teklif alma işlemleri tamamen
                  ücretsizdir.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
