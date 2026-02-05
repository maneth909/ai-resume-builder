"use client";

import { supabase } from "@/lib/supabase/client";
import { Divide } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import { button } from "framer-motion/client";

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={logout}
      className="hidden sm:block px-4 py-2 text-sm font-medium text-tertiary bg-background outline-1 hover:bg-tertiary hover:text-background rounded-lg hover:opacity-90 transition-opacity shadow-sm"
    >
      Logout
    </button>
  );
}
