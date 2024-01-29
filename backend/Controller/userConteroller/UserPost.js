import Post from '../../Model/PostSchema.js'
import User from '../../Model/UserModel.js'


const myPost= async (req, res) => {
    try {
      const { userId } = req.params;
      const userPosts = await Post.find({user:userId}).populate('user').exec();
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

        if (post.likes.includes(currentUserId)) {
            return res.status(400).json({ message: 'Post already liked by the user' });
        }

        post.likes.push(currentUserId);
        await post.save();

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

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


const getPostDetails = async (req, res) => {
  try {
    const postId=req.body
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }



    return res.json(post);
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
    getPostDetails
  
  }