"use client";

import { supabase } from "@/lib/supabase/client";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <Button variant="outline" size="sm" onClick={logout} className="gap-2">
      Logout
    </Button>
  );
}
