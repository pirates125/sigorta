import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
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
          <div>
            <h1 className="text-4xl font-bold mb-4">Gizlilik Politikası</h1>
            <p className="text-muted-foreground">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Giriş</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bu gizlilik politikası, Sigorta Acentesi olarak topladığımız
                bilgileri nasıl kullandığımızı, sakladığımızı ve koruduğumuzu
                açıklar. Hizmetlerimizi kullanarak, bu politikada açıklanan
                uygulamaları kabul etmiş olursunuz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Toplanan Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Kişisel Bilgiler</h3>
                <p className="text-sm text-muted-foreground">
                  Adınız, email adresiniz, telefon numaranız ve diğer iletişim
                  bilgileriniz
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sigorta Bilgileri</h3>
                <p className="text-sm text-muted-foreground">
                  Araç bilgileri, sürücü bilgileri, poliçe detayları
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Teknik Bilgiler</h3>
                <p className="text-sm text-muted-foreground">
                  IP adresi, tarayıcı tipi, cihaz bilgileri, çerez verileri
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Bilgilerin Kullanımı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Topladığımız bilgileri şu amaçlarla kullanırız:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Sigorta teklifleri oluşturmak ve sunmak</li>
                <li>Poliçe işlemlerini gerçekleştirmek</li>
                <li>Müşteri desteği sağlamak</li>
                <li>Hizmet kalitesini iyileştirmek</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Bilgi Paylaşımı</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bilgilerinizi yalnızca aşağıdaki durumlarda üçüncü taraflarla
                paylaşırız:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-4">
                <li>Sigorta şirketleri ile teklif almak için</li>
                <li>Ödeme işlemleri için ödeme sağlayıcıları ile</li>
                <li>Yasal zorunluluklar gereği yetkili makamlarla</li>
                <li>Açık rızanız dahilinde</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Çerezler</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler
                kullanır. Çerezleri tarayıcı ayarlarınızdan kontrol edebilir
                veya silebilirsiniz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Veri Güvenliği</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Verilerinizin güvenliğini sağlamak için endüstri standardı
                güvenlik önlemleri kullanıyoruz. Ancak, internet üzerinden veri
                iletiminin tamamen güvenli olduğunu garanti edemeyiz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Haklarınız</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kişisel verilerinize erişme, düzeltme, silme ve işlenmesini
                kısıtlama hakkına sahipsiniz. Bu haklarınızı kullanmak için
                bizimle iletişime geçebilirsiniz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. İletişim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gizlilik politikamız ile ilgili sorularınız için:
                <br />
                <br />
                Email:{" "}
                <a
                  href="mailto:gizlilik@sigorta.com"
                  className="text-primary hover:underline"
                >
                  gizlilik@sigorta.com
                </a>
                <br />
                Telefon: 0850 555 12 34
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
