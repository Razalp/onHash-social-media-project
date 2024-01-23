import express from 'express'
import multer from 'multer';
import User from '../Model/UserModel.js'
import jwt from "jsonwebtoken"
import Post from '../Model/PostSchema.js'
const router=express.Router();
import {
    signIn, login ,otpVerify, signOut, resendOTP, updateProfile ,    
    editUser,uploadPost,userDashBoard,getProfile

} from '../Controller/userConteroller/UserAuth.js ';

import {
  myPost
} from '../Controller/userConteroller/UserPost.js'

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
router.get('/user-counts',verifyToken, userDashBoard)
router.get('/get-profile/:userId',verifyToken,getProfile)
router.get('/my-post',verifyToken,myPost)

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