export const dynamic = "force-dynamic";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";
import CreateResumeButton from "@/components/CreateResumeButton";
import ResumeCardMenu from "@/components/ResumeCardMenu";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"; // date formatter

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  // check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // fetch Resumes for this user
  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <LogoutButton />
      </div>

      {/* action bar */}
      <div>
        <CreateResumeButton />
      </div>

      {/* resume grid*/}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* empty state */}
        {(!resumes || resumes.length === 0) && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">
              You haven't created any resumes yet.
            </p>
          </div>
        )}

        {/* list of resumes */}
        {resumes?.map((resume) => (
          <div
            key={resume.id}
            className="group relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-500/50"
          >
            <ResumeCardMenu
              resumeId={resume.id}
              currentTitle={resume.title || "Untitled Resume"}
            />

            <Link href={`/resumes/${resume.id}`} className="block mt-2">
              <h3 className="font-semibold text-lg truncate pr-8 mb-1">
                {resume.title || "Untitled Resume"}
              </h3>

              <div className="text-sm text-gray-500 space-y-1 mb-4">
                <p>
                  Created: {new Date(resume.created_at).toLocaleDateString()}
                </p>
                <p>
                  Last updated:{" "}
                  {formatDistanceToNow(new Date(resume.updated_at))} ago
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
