import Post from '../../Model/PostSchema.js'
import User from '../../Model/UserModel.js'


const myPost= async (req, res) => {
    try {
      const { userId } = req.params;

      const userPosts = await Post.find({user:userId}).populate('user').exec();
      console.log(userPosts);

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

  
  export {
    myPost,
    searchUser
  }