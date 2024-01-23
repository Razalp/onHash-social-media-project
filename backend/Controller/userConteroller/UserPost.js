import Post from '../../Model/PostSchema.js'
import User from '../../Model/UserModel.js'


const myPost= async (req, res) => {
    try {
      const userId = req.user._id;
      const userPosts = await Post.find({ user: userId }).populate('user');
      res.json(userPosts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export {
    myPost
  }