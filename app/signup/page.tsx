import SignupForm from "@/components/auth/SignupForm";
import AnimatedGridBackground from "@/components/publicPage/AnimatedGridBackground";

export default function SignupPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <AnimatedGridBackground />
      <div className="relative z-10 w-full flex justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
