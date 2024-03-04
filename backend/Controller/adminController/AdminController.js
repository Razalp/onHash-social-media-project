import User from '../../Model/UserSchema.js'


const userGet =async(req,res)=>{
    try {
        const users = await User.find();
        console.log(users)
        res.json(users);
    } catch (error) {
        
    }
}


const editUser=async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, bio, profilePicture, isAdmin, isUpgrade } = req.body;

    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username;
        user.email = email;
        user.password = password;
        user.bio = bio;
        user.profilePicture = profilePicture;
        user.isAdmin = isAdmin;
        user.isUpgrade = isUpgrade;


        await user.save();

        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteUser= async (req, res) => {
    const userId = req.params.id;

    try {

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const BlockUser = async (req, res) => {
    try {
      const userId = req.params.id; 

      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.isBlocked = !user.isBlocked; 
  
      await user.save();
  
      res.json({ message: 'User blocked/unblocked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

//   const users=async (req, res) => {
//     try {
//         const userCounts = {
//             totalUsers: await User.countDocuments({}),
//             upgradeCount: await User.countDocuments({ isUpgrade: true }),
//             adminCount: await User.countDocuments({ isAdmin: true }),
//             blockedCount: await User.countDocuments({ isBlocked: true }),
//         };
  
//         res.json(userCounts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };




export {
    userGet,
    editUser,
    deleteUser,
    BlockUser,
    // users
}

