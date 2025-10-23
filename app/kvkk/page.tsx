import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KVKKPage() {
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
            <h1 className="text-4xl font-bold mb-4">
              Kişisel Verilerin Korunması Politikası (KVKK)
            </h1>
            <p className="text-muted-foreground">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>1. Veri Sorumlusu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")
                uyarınca, kişisel verileriniz; veri sorumlusu olarak Şirketimiz
                tarafından aşağıda açıklanan kapsamda işlenebilecektir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Toplanan Kişisel Veriler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                Platformumuz aracılığıyla aşağıdaki kişisel verileriniz
                toplanmaktadır:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Kimlik bilgileri (Ad, soyad, TC kimlik numarası)</li>
                <li>İletişim bilgileri (Email, telefon, adres)</li>
                <li>Araç bilgileri (Plaka, marka, model)</li>
                <li>Finansal bilgiler (Ödeme bilgileri)</li>
                <li>İşlem güvenliği bilgileri (IP adresi, çerez bilgileri)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Kişisel Verilerin İşlenme Amaçları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Sigorta teklifi oluşturma ve poliçe düzenleme</li>
                <li>Müşteri ilişkileri yönetimi</li>
                <li>Hizmet kalitesinin artırılması</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Platform güvenliğinin sağlanması</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Haklarınız</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>
                  İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
                  öğrenme
                </li>
                <li>
                  Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri
                  bilme
                </li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>Silinmesini veya yok edilmesini isteme</li>
                <li>Aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li>
                  İşlenen verilerin münhasıran otomatik sistemler ile analiz
                  edilmesi nedeniyle aleyhinize bir sonuç doğmasına itiraz etme
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. İletişim</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Kişisel verileriniz ile ilgili sorularınız ve talepleriniz için
                bizimle iletişime geçebilirsiniz:
                <br />
                <br />
                Email:{" "}
                <a
                  href="mailto:kvkk@sigorta.com"
                  className="text-primary hover:underline"
                >
                  kvkk@sigorta.com
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
