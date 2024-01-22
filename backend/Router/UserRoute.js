import express from 'express'
import multer from 'multer';
import User from '../Model/UserModel.js'
import jwt from "jsonwebtoken"
import Post from '../Model/PostSchema.js'
const router=express.Router();
import {
    signIn,
    login,
    otpVerify,
    signOut,
    resendOTP,
    updateProfile,
    editUser,
    uploadPost

} from '../Controller/userConteroller/UserAuth.js ';

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    console.log(token,"jleoo")

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token,'mySecret');
        req.userId = decoded.userId;

        console.log(decoded,"Decode");
        next();
    } catch (error) {
        console.error(error);
      
    }
};


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/upload'); 
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
  });
  
  const upload =  multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // 5 MB limit, adjust as needed
});

//get
router.get('/user-counts', async (req, res) => {
  try {
      const userCounts = {
          totalUsers: await User.countDocuments({}),
          upgradeCount: await User.countDocuments({ isUpgrade: true }),
          adminCount: await User.countDocuments({ isAdmin: true }),
          blockedCount: await User.countDocuments({ isBlocked: true }),
      };

      res.json(userCounts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/get-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's profile
    res.json({
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      bio: user.bio,
      followers: user.followers,
      profilePicture: user.profilePicture,
      following: user.following,
      isAdmin: user.isAdmin,
      isUpgrade: user.isUpgrade,
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//post


router.post('/signIn',signIn)
router.post('/logIn',login)
router.post('/verify-otp',otpVerify)
router.post('/sign-out',signOut)
router.post('/resendotp',resendOTP)
router.post('/update-profile',verifyToken, upload.single('profilePicture'), updateProfile);


//put 
router.put('/users/:userId',verifyToken,editUser)
router.post('/upload-post', verifyToken, upload.array('images', 5), uploadPost);
  



export default router