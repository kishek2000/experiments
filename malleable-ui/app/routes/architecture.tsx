import type { Route } from "./+types/architecture";
import ArchitectureContent from "../components/architecture-content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Architecture Documentation | Generative UI Platform" },
    { name: "description", content: "Complete technical documentation for the Generative UI Platform architecture" },
  ];
}

export default function Architecture() {
  return <ArchitectureContent />;
}
