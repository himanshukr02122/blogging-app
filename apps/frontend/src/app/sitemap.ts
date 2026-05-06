import { listPublishedBlogs } from "@/lib/blogs";
import { Blog } from "./types/blog";

export default async function sitemap() {
    const blogs: Blog[] = await listPublishedBlogs();

    return [
        {
            url: "https://blogging-app-frontend-ten.vercel.app",
            lastModified: new Date(),
        },
        ...(blogs).map((blog) => ({
            url: `https://blogging-app-frontend-ten.vercel.app/blogs/${blog.id}`,
            lastModified: new Date(blog.updated_at),
        })),
    ];
}