import Post from '../../Model/PostSchema.js'
import User from '../../Model/UserModel.js'
import Follow from '../../Model/FollowSchema.js';
import Story from '../../Model/storySchema.js'
const myPost= async (req, res) => {
    try {
      const { userId } = req.params;
      const userPosts = await Post.find({user:userId})
      .populate('user')
      .sort({ createdAt: -1 })
      .exec();
      res.json(userPosts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const searchUser= async (req, res) => {
    try {
      const { query } = req.query;

      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
        ],
      });
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  const LikePost = async function LikePost(req, res) {
    const { postId } = req.params;
    const { currentUserId } = req.body;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const likedIndex = post.likes.findIndex(like => like._id.toString() === currentUserId);
  
      if (likedIndex !== -1) {
        post.likes.splice(likedIndex, 1);
      } else {
        post.likes.push(currentUserId);
      }
  
      await post.save();
  
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };


const comments =async (req, res) => {

  const { postId } = req.params;
  const { currentUserId, text } = req.body;

  try {
      const post = await Post.findById(postId);

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      const newComment = {
          user: currentUserId,
          text,
          createdAt: new Date(),
      };

      post.comments.push(newComment);
      await post.save();

      res.json(post);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


const report =async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { userId, reason } = req.body;
    if (post.reportedBy.includes(userId)) {
      return res.status(400).json({ message: 'User has already reported this post' });
    }

    post.reports.push({ user: userId, reason });

    post.reportedBy.push(userId);

    await post.save();

    return res.status(200).json({ message: 'Post reported successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getPostDetails = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate('likes')
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likes = post.likes.map(user => ({ user }));
    const comments = post.comments.map(comment => ({
      user: comment.user,
      text: comment.text,
      createdAt: comment.createdAt,
    }));
    const hasLiked = post.likes.some(like => like._id.toString() === userId);

    res.json({ likes, comments, hasLiked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const homePost =async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await Follow.findOne({ user: userId }).populate('following');
    if (!following) {
      return res.status(404).json({ message: 'User is not following anyone yet.' });
    }
    const followingUserIds = following.following.map(user => user._id);

    const posts = await Post.find({ user: { $in: followingUserIds } })
      .populate('user')
      .sort({ createdAt: -1 });  
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const stories = async (req, res) => {
  try {
    const { content, userId } = req.body;
    const mediaPath = req.file.path;
    const fileName = req.file.filename; // Extract just the file name

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newStory = new Story({
      user: userId,
      content,
      media: fileName, 
      expiresAt,
    });

    const savedStory = await newStory.save();

    res.status(201).json(savedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


  export {
    myPost,
    searchUser,
    LikePost,
    comments,
    report,
    getPostDetails,
    homePost, 
    stories
  
  }