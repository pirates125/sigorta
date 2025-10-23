"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Custom logout endpoint
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Çıkış
    </Button>
  );
}
