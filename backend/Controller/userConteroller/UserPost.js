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
    console.log("heloooooooo")
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

const commaets =async (req, res) => {
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






  export {
    myPost,
    searchUser,
    LikePost,
    commaets
  
  }