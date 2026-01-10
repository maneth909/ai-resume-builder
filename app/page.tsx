// app/page.tsx
import Button from "../components/Button";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
      <div className="flex flex-wrap gap-4 items-center">
        <p className="text-base">Test buttons</p>
        {/* Solid Primary (Default) */}
        <Button>Save Changes</Button>

        {/* Outline */}
        <Button variant="outline">Edit Profile</Button>

        {/* Secondary (Grey) */}
        <Button variant="secondary">Cancel</Button>

        {/* Sizes */}
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>

        {/* Disabled */}
        <Button disabled>Disabled</Button>

        {/* Loading State */}
        <Button isLoading>Processing...</Button>
      </div>

      <ThemeToggle />
    </div>
  );
}
