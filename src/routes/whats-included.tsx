import { createFileRoute } from "@tanstack/react-router";
import { WhatsIncludedScreen } from "@/screens/WhatsIncludedScreen";

export const Route = createFileRoute("/whats-included")({
  component: WhatsIncludedScreen,
});
