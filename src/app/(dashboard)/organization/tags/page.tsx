import prisma from "@/lib/prisma"
import { TagsClientPage } from "./components/tags-client-page"
import { Tag } from "@prisma/client"

async function getAllTags() {
    // 1. Get all explicitly defined tags
    const definedTags = await prisma.tag.findMany();

    // 2. Discover tags from various models
    const deviceTags = (await prisma.device.findMany({ select: { tags: true } })).flatMap(d => d.tags);
    const regionTags = (await prisma.region.findMany({ select: { tags: true } })).flatMap(r => r.tags);
    const siteTags = (await prisma.site.findMany({ select: { tags: true } })).flatMap(s => s.tags);
    const rackTags = (await prisma.rack.findMany({ select: { tags: true } })).flatMap(r => r.tags);
    const prefixTags = (await prisma.prefix.findMany({ select: { tags: true } })).flatMap(p => p.tags);
    
    const allDiscoveredTagNames = [...new Set([...deviceTags, ...regionTags, ...siteTags, ...rackTags, ...prefixTags])];

    const discoveredTags: Tag[] = allDiscoveredTagNames.map(name => ({
        id: `discovered-${name}`,
        name,
        description: "", // No description for discovered tags
    }));

    // 3. Combine and de-duplicate, giving precedence to defined tags
    const combined = [...definedTags, ...discoveredTags];
    const uniqueTags = Array.from(
      new Map(combined.map((tag) => [tag.name.toLowerCase(), tag])).values()
    );

    uniqueTags.sort((a, b) => a.name.localeCompare(b.name));

    return uniqueTags;
}


export default async function TagsPage() {
    const allTags = await getAllTags();

    return (
        <TagsClientPage initialAllTags={allTags} />
    )
}
