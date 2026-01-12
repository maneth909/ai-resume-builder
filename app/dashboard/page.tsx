import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import CreateResumeButton from "@/components/CreateResumeButton";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // middleware will redirect
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">My Resumes</h1>

      {/* This is your new button */}
      <CreateResumeButton />

      <div className="mt-8">
        <p className="text-gray-500">
          Your existing resumes will appear here later.
        </p>
      </div>
    </div>
  );
}
