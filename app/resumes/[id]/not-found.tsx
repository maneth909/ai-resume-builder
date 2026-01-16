import Link from "next/link";

export default function ResumeNotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4 text-center">
      {/* Icon Wrapper */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10 text-muted"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h.008v.008H9V12Zm3 0h.008v.008H12V12Zm3 0h.008v.008H15V12Z"
            className="opacity-50"
          />
        </svg>
      </div>

      {/* Heading */}
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-tertiary">
        Resume Not Found
      </h2>

      {/* Description */}
      <p className="mb-8 max-w-md text-muted text-lg">
        The resume you are looking for might have been removed, made private, or
        the link is incorrect.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-transparent px-6 py-3 font-medium text-tertiary transition-colors hover:bg-secondary"
        >
          View All Resumes
        </Link>
      </div>
    </div>
  );
}
