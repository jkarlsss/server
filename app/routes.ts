import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/auth/sign-in.tsx"),
  route("api/create-trip", "routes/api/create-trip.ts"),
  layout("routes/admin/layout.tsx", [
    route("/", "routes/admin/dashboard.tsx"),
    route("all-users", "routes/admin/all-users.tsx"),
    route("trips/create", "routes/admin/create-trip.tsx"),
    route("trips", "routes/admin/trips.tsx"),
  ])
] satisfies RouteConfig;
