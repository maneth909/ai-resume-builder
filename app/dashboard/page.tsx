import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // middleware will redirect
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user.email}</p>
      <LogoutButton />
    </div>
  );
}
