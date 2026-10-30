import { MetadataRoute } from 'next';
import { TOOLS_DIRECTORY } from '@/lib/tools-sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ongoweightloss.com';
  const currentDate = new Date();

  const toolRoutes = TOOLS_DIRECTORY.map(tool => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: tool.id === 'overview' ? 1.0 : tool.id === 'keywords-harvester' || tool.id === 'internal-links' || tool.id === 'competitor-gap' ? 0.9 : 0.8,
  }));

  return [
    ...toolRoutes,
    {
      url: `${baseUrl}/sitemap`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.85
    }
  ];
}

