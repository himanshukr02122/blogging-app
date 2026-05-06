import { listPublishedBlogs } from "@/lib/blogs";
import { Blog } from "./types/blog";

export const dynamic = "force-dynamic";

const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

export default async function sitemap() {
    try {
        const blogs: Blog[] = await listPublishedBlogs();

        return [
            {
                url: BASE_URL,
                lastModified: new Date(),
            },
            ...blogs.map((blog) => ({
                url: `${BASE_URL}/blogs/${blog.id}`,
                lastModified: new Date(blog.updated_at),
            })),
        ];
    } catch (err) {
        console.error("Sitemap error:", err);

        return [
            {
                url: BASE_URL,
                lastModified: new Date(),
            },
        ];
    }
}