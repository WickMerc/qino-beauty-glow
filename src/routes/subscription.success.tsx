import { createFileRoute } from "@tanstack/react-router";
import { SubscriptionSuccessScreen } from "@/screens/SubscriptionSuccessScreen";

export const Route = createFileRoute("/subscription/success")({
  component: SubscriptionSuccessScreen,
});
