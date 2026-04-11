export type UserRole = "admin" | "author";

export type User = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type BlogStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "withdrawn";

export type BlogReviewComment = {
  id: number;
  status: BlogStatus;
  comment: string;
  created_at: string;
  admin: User;
};

export interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  status: BlogStatus;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  author: User;
  review_comments: BlogReviewComment[];
}