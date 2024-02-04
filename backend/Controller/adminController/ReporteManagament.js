import Post from "../../Model/PostSchema.js";
import User from '../../Model/UserModel.js'

const getReported=async (req, res) => {
    try {
      console.log('getreportedddd')
  
      const reportedPosts = await Post.find({ reports: { $exists: true, $not: { $size: 0 } } })
        .populate('user', 'username')  
        .populate('reports.user', 'username') 
        console.log(reportedPosts)
  
      res.json(reportedPosts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };



  export {
    getReported
  }
  