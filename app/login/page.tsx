import LoginForm from "@/components/auth/LoginForm";
import AnimatedGridBackground from "@/components/publicPage/AnimatedGridBackground";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <AnimatedGridBackground />
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
