const prisma = require('../lib/prisma');

const createPost = async (req, res) => {
  try {
    const { title, content, scheduled_at, channels, media } = req.body;
    const user_id = req.user.id;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
        user_id,
        status: scheduled_at ? 'SCHEDULED' : 'DRAFT',
        channels: {
          create: channels && channels.length > 0 ? channels.map(channel => ({
            integration_id: channel.integration_id,
          })) : []
        },
        media: {
          create: media && media.length > 0 ? media.map(m => ({
            url: m.url,
            type: m.type
          })) : []
        }
      },
      include: {
        channels: true,
        media: true
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        channels: {
          include: {
            integration: true
          }
        },
        media: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

module.exports = {
  createPost,
  getPosts
};
