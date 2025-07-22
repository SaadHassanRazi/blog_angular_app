import { Request, Response } from 'express';
import prisma from '../prisma/client';


export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = (req as any).user?.id; // assuming auth middleware sets this

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });

    return res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 5; // You can change this based on UI needs

  try {
    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, email: true },
          },
        },
      }),
      prisma.post.count(),
    ]);

    const totalPages = Math.ceil(totalPosts / pageSize);

    return res.status(200).json({
      currentPage: page,
      totalPages,
      totalPosts,
      posts,
    });
  } catch (err) {
    console.error('Get posts error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const { title, content } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    // Check if post exists and is owned by the user
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'You can only update your own posts' });
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id);
  const userId = (req as any).user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
