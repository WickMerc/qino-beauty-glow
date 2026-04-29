import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JSX component without types
import QinoApp from "@/components/QinoApp";

export const Route = createFileRoute("/")({
  component: QinoApp,
});
