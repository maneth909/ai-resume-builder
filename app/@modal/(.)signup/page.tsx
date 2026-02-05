// app/@modal/(.)signup/page.tsx
import SignupForm from "@/components/auth/SignupForm";
import Modal from "@/components/UI/Modal";

export default function InterceptedSignupPage() {
  return (
    <Modal>
      <SignupForm />
    </Modal>
  );
}
