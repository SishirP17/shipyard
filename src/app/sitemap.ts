import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { REPORT_SLUGS } from "@/lib/reports/slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...REPORT_SLUGS.map((slug) => ({
      url: `${SITE.url}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
