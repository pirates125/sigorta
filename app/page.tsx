import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Car,
  Home,
  Heart,
  Shield,
  CheckCircle,
  Clock,
  TrendingDown,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Sigorta Acentesi</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#hizmetler"
              className="text-sm font-medium hover:text-primary"
            >
              Hizmetler
            </Link>
            <Link
              href="#nasil-calisir"
              className="text-sm font-medium hover:text-primary"
            >
              Nasıl Çalışır?
            </Link>
            <Link
              href="#iletisim"
              className="text-sm font-medium hover:text-primary"
            >
              İletişim
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link href="/auth/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              En Uygun Sigorta Fiyatlarını Kolayca Bulun
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Onlarca sigorta şirketinin tekliflerini anında karşılaştırın.
              Dakikalar içinde en uygun fiyatı bulun ve poliçenizi online olarak
              alın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/trafik">
                <Button size="lg" className="text-lg px-8">
                  Hemen Teklif Al
                </Button>
              </Link>
              <Link href="#nasil-calisir">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Nasıl Çalışır?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Hızlı ve Kolay</CardTitle>
                <CardDescription>
                  Formu doldurun, 2-3 dakika içinde tüm şirketlerden teklif alın
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingDown className="h-12 w-12 text-primary mb-4" />
                <CardTitle>En Uygun Fiyat</CardTitle>
                <CardDescription>
                  Onlarca şirketi karşılaştırın, en ucuz teklifi bulun
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Güvenli ve Garantili</CardTitle>
                <CardDescription>
                  TOBBA kayıtlı acentemiz ile güvenle poliçe alın
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="hizmetler" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sigorta Türlerimiz</h2>
            <p className="text-muted-foreground">
              Tüm sigorta ihtiyaçlarınız için tek adres
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/trafik">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Car className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Trafik Sigortası</CardTitle>
                  <CardDescription>
                    Zorunlu trafik sigortası için en uygun fiyatları bulun
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0">
                    Teklif Al →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/kasko">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Kasko Sigortası</CardTitle>
                  <CardDescription>
                    Aracınızı her türlü hasara karşı koruyun
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0">
                    Teklif Al →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dask">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Home className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>DASK</CardTitle>
                  <CardDescription>
                    Zorunlu deprem sigortası ile evinizi güvence altına alın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0">
                    Teklif Al →
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/saglik">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Heart className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Sağlık Sigortası</CardTitle>
                  <CardDescription>
                    Kendiniz ve aileniz için kapsamlı sağlık güvencesi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0">
                    Teklif Al →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="nasil-calisir" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nasıl Çalışır?</h2>
            <p className="text-muted-foreground">
              3 basit adımda sigorta poliçenizi alın
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Formu Doldurun</h3>
              <p className="text-muted-foreground">
                Sigorta türünü seçin ve gerekli bilgileri girin
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Fiyatları Karşılaştırın
              </h3>
              <p className="text-muted-foreground">
                Tüm şirketlerin tekliflerini yan yana görün
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Poliçe Alın</h3>
              <p className="text-muted-foreground">
                En uygun teklifi seçin ve online olarak satın alın
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Sigorta Acentesi</span>
              </div>
              <p className="text-sm text-muted-foreground">
                TOBBA kayıtlı, güvenilir sigorta acentesi
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Sigorta Türleri</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/trafik">Trafik Sigortası</Link>
                </li>
                <li>
                  <Link href="/kasko">Kasko</Link>
                </li>
                <li>
                  <Link href="/dask">DASK</Link>
                </li>
                <li>
                  <Link href="/saglik">Sağlık Sigortası</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kurumsal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/hakkimizda">Hakkımızda</Link>
                </li>
                <li>
                  <Link href="/iletisim">İletişim</Link>
                </li>
                <li>
                  <Link href="/kvkk">KVKK</Link>
                </li>
                <li>
                  <Link href="/gizlilik">Gizlilik Politikası</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: info@sigorta.com</li>
                <li>Tel: 0850 XXX XX XX</li>
                <li>Adres: İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Sigorta Acentesi. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
