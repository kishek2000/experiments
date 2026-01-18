import type { Route } from "./+types/resources";
import ResourcesContent from "../components/resources-content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pre-Reading Resources | Generative UI Platform" },
    { name: "description", content: "Essential research, tools, and references for understanding malleable software and generative UI" },
  ];
}

export default function ResourcesPage() {
  return <ResourcesContent />;
}

