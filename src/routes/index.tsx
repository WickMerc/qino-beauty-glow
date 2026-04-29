import { createFileRoute } from "@tanstack/react-router";
import QinoApp from "@/components/QinoApp";

export const Route = createFileRoute("/")({
  component: QinoApp,
});
