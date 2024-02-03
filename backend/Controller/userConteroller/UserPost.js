import Post from '../../Model/PostSchema.js'
import User from '../../Model/UserModel.js'
import Follow from '../../Model/FollowSchema.js';
import mongoose from 'mongoose';
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

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
      if (!isValidObjectId(postId)) {
        console.error('Invalid Post ID');
        return res.status(400).json({ message: 'Invalid Post ID' });
      }
  
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      const likedIndex = post.likes.indexOf(currentUserId);
  
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
    console.log('hello')
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


const getPostDetails =  async (req, res) => {
  const postId = req.params.postId;

  try {
      const post = await Post.findById(postId)
          .populate('likes')
          .populate({
              path: 'comments.user',
              select: '-password', 
          });
          console.log(post)

      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      const likes = post.likes.map(user => ({ user }));
      const comments = post.comments.map(comment => ({
          user: comment.user,
          text: comment.text,
          createdAt: comment.createdAt,
      }));
      console.log(comments)

      res.json({ likes, comments });
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

      console.log(posts)
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};







  export {
    myPost,
    searchUser,
    LikePost,
    comments,
    report,
    getPostDetails,
    homePost
  
  }