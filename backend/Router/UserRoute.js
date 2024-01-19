import express from 'express'
import multer from 'multer';
import User from '../Model/UserModel.js'
import jwt from "jsonwebtoken"
import {
    signIn,
    login,
    otpVerify,
    signOut,
    resendOTP,
    updateProfilePicture
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
        // return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

const router=express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/upload/'); 
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




router.post('/signIn',signIn)
router.post('/logIn',login)
router.post('/verify-otp',otpVerify)
router.post('/sign-out',signOut)
router.post('/resendotp',resendOTP)
router.post('/update-profile',verifyToken, upload.single('profilePicture'), updateProfilePicture);



//put

// router.post('/edit-profile', upload.single('profilePicture'), async (req, res) => {
//     try {
//         const { username, bio } = req.body;
//         const userId = req.user.id;

//         const updatedFields = {
//             username: username || existingUser.username,
//             bio: bio || existingUser.bio,
//         };

//         if (req.file) {
//             updatedFields.profilePicture = req.file.path;
//         }

//         const updatedUser = await User.findByIdAndUpdate(userId, { $set: updatedFields }, { new: true });

//         if (!updatedUser) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.status(200).json(updatedUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

export default router