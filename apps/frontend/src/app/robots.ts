export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/dashboard/",
                    "/blogs/*/preview",
                ],
            },
        ],
        sitemap: "https://blogging-app-frontend-ten.vercel.app/sitemap.xml",
    };
}