import express from 'express'
import multer from 'multer';
import User from '../Model/UserModel.js'
import jwt from "jsonwebtoken"
import Post from '../Model/PostSchema.js'
import { verifyToken } from '../MiddelWare/verifyToken.js';

import verifyRefreshToken from '../MiddelWare/refreshToken.js';
import upload from '../MiddelWare/multerConfig.js';
const router=express.Router();
import {
    signIn, login ,otpVerify, signOut, resendOTP, updateProfile ,editUser,uploadPost,userDashBoard,getProfile
} from '../Controller/userConteroller/UserAuth.js ';

import {
  myPost ,searchUser,
} from '../Controller/userConteroller/UserPost.js'

import { follow ,unFollow ,getFollowers ,UsergetFollowers } from '../Controller/userConteroller/Follow.js'

//get
router.get('/user-counts',verifyToken, userDashBoard)
router.get('/get-profile/:userId',verifyToken,getProfile)
router.get('/my-post/:userId', verifyToken, myPost);

router.get('/serachUser-post/:userId', verifyToken, myPost);
router.get('/searchUser',verifyToken,searchUser)


//post
router.post('/refresh-token', verifyRefreshToken, (req, res) => {
  try {
      const newTokens = generateTokens({ _id: req.userId, isAdmin: req.isAdmin });
      res.status(200).json(newTokens);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.post('/signIn',signIn)
router.post('/logIn',login)
router.post('/verify-otp',otpVerify)
router.post('/sign-out',signOut)
router.post('/resendotp',resendOTP)
router.post('/update-profile',verifyToken, upload.single('profilePicture'), updateProfile);
router.post('/upload-post', verifyToken, upload.array('images', 5), uploadPost);


//follow

router.post('/follow/:userId',verifyToken,follow)
router.post('/unfollow/:userId',verifyToken,unFollow)
router.get('/followers/:userId',verifyToken,getFollowers)
router.get('/getUserFollows/:userId',verifyToken,UsergetFollowers)




//put 
router.put('/users/:userId',verifyToken,editUser)

  

























export default router