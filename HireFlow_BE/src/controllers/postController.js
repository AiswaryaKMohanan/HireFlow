import prisma from '../config/prisma.js';

const sanitizeText = (value, fallback = '') => {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || fallback;
};

export const getPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ posts });
};

export const createPost = async (req, res) => {
  const { title, content, author } = req.body || {};
  const normalizedTitle = sanitizeText(title);
  const normalizedContent = sanitizeText(content);
  const normalizedAuthor = sanitizeText(author, 'anonymous');

  if (!normalizedTitle || !normalizedContent) {
    return res.status(400).json({
      message: 'Title and content are required',
    });
  }

  const post = await prisma.post.create({
    data: {
      title: normalizedTitle,
      content: normalizedContent,
      author: normalizedAuthor,
    },
  });

  return res.status(201).json({
    message: 'Post created successfully',
    post,
  });
};
