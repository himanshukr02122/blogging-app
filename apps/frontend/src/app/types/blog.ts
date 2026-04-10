export interface Blog {
    id: string;
    title: string;
    summary: string;
    author: {
        name: string;
        avatar: string;
        headline: string;
    };
    tags: string[];
    likes: number;
    isSaved: boolean;
}