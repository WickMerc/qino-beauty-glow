import { createFileRoute } from "@tanstack/react-router";
import { PricingScreen } from "@/screens/PricingScreen";

export const Route = createFileRoute("/pricing")({
  component: PricingScreen,
});
