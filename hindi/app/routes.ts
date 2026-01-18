import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Dashboard
  index("routes/_index.tsx"),
  
  // Learn section with nested routes
  route("learn", "routes/learn.tsx", [
    index("routes/learn._index.tsx"),
    route(":phaseId", "routes/learn.$phaseId.tsx"),
    route(":phaseId/:lessonId", "routes/learn.$phaseId.$lessonId.tsx"),
  ]),
  
  // Practice section with nested routes
  route("practice", "routes/practice.tsx", [
    index("routes/practice._index.tsx"),
    route("write", "routes/practice.write.tsx"),
    route("recognize", "routes/practice.recognize.tsx"),
  ]),
  
  // Reference section with nested routes
  route("reference", "routes/reference.tsx", [
    index("routes/reference._index.tsx"),
    route(":letterId", "routes/reference.$letterId.tsx"),
  ]),
  
  // Progress page
  route("progress", "routes/progress.tsx"),
  
  // Settings page
  route("settings", "routes/settings.tsx"),
] satisfies RouteConfig;
