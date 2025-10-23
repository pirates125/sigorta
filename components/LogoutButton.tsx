"use client";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const handleLogout = () => {
    // NextAuth v5 signout - form submit kullan
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/signout";
    
    // CSRF token (NextAuth v5 gerektirir)
    const csrfToken = document.querySelector('input[name="csrfToken"]')?.getAttribute('value');
    if (csrfToken) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "csrfToken";
      input.value = csrfToken;
      form.appendChild(input);
    }
    
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Çıkış
    </Button>
  );
}
