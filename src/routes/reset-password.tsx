import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordScreen } from "@/screens/auth/ResetPasswordScreen";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordScreen,
});
