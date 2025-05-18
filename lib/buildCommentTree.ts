// utils/buildCommentTree.ts

interface User {
  name?: string | null;
  image?: string | null;
}

export interface CommentType {
  id: string;
  content: string;
  user?: User | null;
  replies?: CommentType[];
  createdAt: Date;
  parentId?: string | null;
}

export function buildCommentTree(flatComments: CommentType[]): CommentType[] {
  const commentMap: { [key: string]: CommentType & { replies: CommentType[] } } = {};

  flatComments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  const rootComments: CommentType[] = [];

  flatComments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.replies.push(commentMap[comment.id]);
      }
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });

  // 🔧 Explicitly type the return value
  const sortReplies = (comments: CommentType[]): CommentType[] => {
    return comments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((c) => ({
        ...c,
        replies: sortReplies(c.replies || []),
      }));
  };

  return sortReplies(rootComments);
}
