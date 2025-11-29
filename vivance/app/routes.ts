import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("packages", "routes/packages.tsx"),
  route("packages/:id", "routes/package.$id.tsx"),
  route("destinations", "routes/destinations.tsx"),
] satisfies RouteConfig;
