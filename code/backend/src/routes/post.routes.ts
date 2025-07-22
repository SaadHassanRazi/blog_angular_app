import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller";
import { authenticate } from "../middleware/auth.middleware";
import prisma from "../prisma/client";

const router = Router();

router.post("/post", authenticate, createPost);
router.get("/", getPosts);
router.get("/post/:id", async (req, res) => {
  const postId = req.params.id;
  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
  });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  return res.status(200).json(post);
});
router.put("/post/:id", authenticate, updatePost);
router.delete("/post/:id", authenticate, deletePost);

export default router;
