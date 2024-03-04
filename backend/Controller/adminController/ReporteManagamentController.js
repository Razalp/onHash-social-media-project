import Post from "../../Model/PostSchema.js";

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

  const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



  export {
    getReported,
    deletePost
  }
  