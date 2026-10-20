import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/app",
    name: "TROBOS — Urban Mobility Concept",
    short_name: "TROBOS",
    description: "Prototipe simulasi mobilitas rescue dan tandem (bukan layanan darurat aktif).",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#101B25",
    theme_color: "#101B25",
    icons: [
      { src: "/brand-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/brand-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
