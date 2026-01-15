import Button from "../components/button/Button";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-4xl font-bold">Welcome to AI Resume Builder</h1>
      <Link href="/login">
        <Button>Go to Login Page to get started</Button>
      </Link>
      <ThemeToggle />
    </div>
  );
}
