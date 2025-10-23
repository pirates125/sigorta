"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "BROKER" | "ADMIN";
  blocked: boolean;
  createdAt: Date;
  _count: {
    quotes: number;
    policies: number;
    commissions: number;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Yetkiniz yok");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Kullanıcılar yüklenemedi");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (userId: string, currentStatus: boolean) => {
    setToggling(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-block`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "İşlem başarısız");
      }

      toast.success(data.message);

      // Liste güncelle
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, blocked: data.blocked } : u
        )
      );
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setToggling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const roleLabels = {
    USER: { label: "Kullanıcı", color: "bg-gray-100 text-gray-800" },
    BROKER: { label: "Broker", color: "bg-blue-100 text-blue-800" },
    ADMIN: { label: "Admin", color: "bg-purple-100 text-purple-800" },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Admin Paneli</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Dashboard'a Dön
              </Link>
              <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
              <p className="text-muted-foreground mt-1">
                {users.length} kayıtlı kullanıcı
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tüm Kullanıcılar</CardTitle>
              <CardDescription>
                Platform kullanıcıları ve rolleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Kayıt Tarihi</TableHead>
                    <TableHead>Sorgular</TableHead>
                    <TableHead>Poliçeler</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name || "İsimsiz"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            roleLabels[user.role].color
                          }`}
                        >
                          {roleLabels[user.role].label}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(user.createdAt)}
                      </TableCell>
                      <TableCell>{user._count.quotes}</TableCell>
                      <TableCell>{user._count.policies}</TableCell>
                      <TableCell>
                        {user.blocked ? (
                          <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                            Engellenmiş
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                            Aktif
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role === "ADMIN" ? (
                          <span className="text-xs text-muted-foreground">
                            Admin
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant={user.blocked ? "default" : "destructive"}
                            onClick={() => toggleBlock(user.id, user.blocked)}
                            disabled={toggling === user.id}
                          >
                            {toggling === user.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            ) : user.blocked ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Engeli Kaldır
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4 mr-1" />
                                Engelle
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
