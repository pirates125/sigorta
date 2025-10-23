import Link from "next/link";
import { Shield, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
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
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Hakkımızda</h1>
            <p className="text-xl text-muted-foreground">
              Türkiye'nin en güvenilir online sigorta karşılaştırma platformu
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Misyonumuz</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p>
                Sigorta Acentesi olarak, müşterilerimize en uygun ve en kaliteli
                sigorta ürünlerini sunmayı hedefliyoruz. Onlarca sigorta
                şirketinin tekliflerini tek platformda toplayarak, karşılaştırma
                ve seçim sürecini kolaylaştırıyoruz.
              </p>
              <p>
                Akıllı karşılaştırma algoritmamız sayesinde sadece fiyat değil,
                kapsam, şirket güvenilirliği ve hizmet kalitesi gibi faktörleri
                de değerlendirerek size en iyi teklifi sunuyoruz.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-2" />
                <CardTitle>TOBBA Üyesi</CardTitle>
                <CardDescription>
                  Türkiye Odalar ve Borsalar Birliği kayıtlı acenteyiz
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-2" />
                <CardTitle>10,000+ Müşteri</CardTitle>
                <CardDescription>
                  Binlerce müşterimiz güvenle hizmet alıyor
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-2" />
                <CardTitle>20+ Şirket</CardTitle>
                <CardDescription>
                  Tüm büyük sigorta şirketleriyle çalışıyoruz
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Neden Bizi Seçmelisiniz?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Akıllı Karşılaştırma</h3>
                    <p className="text-muted-foreground">
                      Sadece fiyat değil, kapsam ve güvenilirlik de
                      değerlendiriyoruz
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hızlı ve Kolay</h3>
                    <p className="text-muted-foreground">
                      Dakikalar içinde en iyi teklifleri alın
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Güvenli ve Şeffaf</h3>
                    <p className="text-muted-foreground">
                      Tüm işlemleriniz güvenli altyapımızda gerçekleşir
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">7/24 Destek</h3>
                    <p className="text-muted-foreground">
                      Müşteri hizmetlerimiz her zaman yanınızda
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hemen Başlayın</h2>
            <p className="text-muted-foreground mb-6">
              En uygun sigorta fiyatlarını karşılaştırmaya başlayın
            </p>
            <Link href="/#hizmetler">
              <Button size="lg">Teklif Al</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
