import { Blog } from "../app/types/blog";

const tagPool = ["react", "javascript", "frontend", "css", "nextjs"];

export const blogs: Blog[] = Array.from({ length: 12 }).map((_, i) => {
    const randomTags = tagPool.sort(() => 0.5 - Math.random()).slice(0, 2);

    return {
        id: `${i}`,
        title: `Understanding React Patterns ${i + 1}`,
        summary:
            "This blog explains advanced React patterns like compound components, render props, and hooks in a very practical way.",
        author: {
            name: "Himanshu",
            avatar: "https://i.pravatar.cc/150?img=" + (i + 1),
            headline: "Frontend Developer",
        },
        tags: randomTags,
        likes: Math.floor(Math.random() * 100),
        isSaved: false,
    };
});