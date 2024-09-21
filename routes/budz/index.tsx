import { Landing } from "@/islands/landing.tsx";
import { RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
    skipInheritedLayouts: true,
};

export default function LandingPage() {
    return <Landing />;
}
