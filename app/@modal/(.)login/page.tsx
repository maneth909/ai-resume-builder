// app/@modal/(.)login/page.tsx
import LoginForm from "@/components/auth/LoginForm";
import Modal from "@/components/UI/Modal";

export default function InterceptedLoginPage() {
  return (
    <Modal>
      <LoginForm />
    </Modal>
  );
}
