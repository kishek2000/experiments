import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("page/:pageId", "routes/page.tsx"),
    route("whiteboard/:boardId", "routes/whiteboard.tsx"),
  ]),
] satisfies RouteConfig;
