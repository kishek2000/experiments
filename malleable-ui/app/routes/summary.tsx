import type { Route } from "./+types/summary";
import ExecutiveSummary from "../components/executive-summary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Executive Summary | Generative UI Platform" },
    { name: "description", content: "High-level overview of the Generative UI Platform architecture" },
  ];
}

export default function Summary() {
  return <ExecutiveSummary />;
}

