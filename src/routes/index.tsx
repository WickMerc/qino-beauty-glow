import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JSX component without types
import QinoOnboarding from "@/components/QinoOnboarding";

function Home() {
  return <QinoOnboarding onComplete={(data: unknown) => console.log("Onboarding done:", data)} />;
}

export const Route = createFileRoute("/")({
  component: Home,
});
