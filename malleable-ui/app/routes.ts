import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("architecture", "routes/architecture.tsx"),
  route("summary", "routes/summary.tsx"),
  route("resources", "routes/resources.tsx"),
] satisfies RouteConfig;
