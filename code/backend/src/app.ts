import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import postRoutes from './routes/post.routes';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors())

app.use(express.json());

app.use('/auth', authRoutes); // Mount /auth/register
app.use('/posts', postRoutes);

app.get('/', (_req, res) => {
  res.send('Blog API is working 🚀');
});

export default app;
