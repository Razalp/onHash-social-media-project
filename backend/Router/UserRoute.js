import express from 'express'
import { verifyToken } from '../MiddelWare/verifyToken.js';

import verifyRefreshToken from '../MiddelWare/refreshToken.js';
import upload from '../MiddelWare/multerConfig.js';
const router=express.Router();
import {
    signIn, login ,otpVerify, signOut, resendOTP, updateProfile ,editUser,uploadPost,userDashBoard,getProfile
} from '../Controller/userConteroller/UserAuth.js ';

import {
  myPost ,searchUser ,LikePost,comments ,report,getPostDetails ,homePost,stories,getStories,notificationsOfUser
} from '../Controller/userConteroller/UserPost.js'

import { follow ,unFollow ,getFollowers ,UsergetFollowers ,mutualFriends } from '../Controller/userConteroller/Follow.js'
import { chatSend, receiver , chatHistories } from '../Controller/userConteroller/Chating.js'
import { deleteProfile } from '../Controller/userConteroller/UserAuth.js';


router.get('/user-counts',verifyToken, userDashBoard)
router.get('/get-profile/:userId',verifyToken,getProfile)
router.get('/my-post/:userId', verifyToken, myPost);

router.get('/serachUser-post/:userId', verifyToken, myPost);
router.get('/searchUser',verifyToken,searchUser)
router.get('/notifications/:userId', verifyToken, notificationsOfUser)





//post
router.post('/signIn',signIn)
router.post('/logIn',login)
router.post('/verify-otp',otpVerify)
router.post('/sign-out',signOut)
router.post('/resendotp',resendOTP)
router.post('/update-profile',verifyToken, upload.single('profilePicture'), updateProfile);
router.delete('/delete-profile-picture/:userId',verifyToken,deleteProfile)
router.post('/upload-post', verifyToken, upload.array('images', 5), uploadPost);
router.post('/stories', verifyToken, upload.single('media'),stories)
router.get('/getStories/:userId',verifyToken,getStories)



//follow

router.post('/follow/:userId',verifyToken,follow)
router.post('/unfollow/:userId',verifyToken,unFollow)
router.post('/followers/:userId',verifyToken,getFollowers)
router.get('/getUserFollows/:userId',verifyToken,UsergetFollowers)
router.get('/mutual-friends/:currentUserId/:userId',verifyToken,mutualFriends)

//likeAndcommant
router.post('/likes/:postId',verifyToken,LikePost)
router.post('/comments/:postId',verifyToken,comments)
router.post('/report/:postId',verifyToken,report)

router.get('/getPostDetailes/:postId/:userId', verifyToken, getPostDetails);
router.get('/home/:userId',verifyToken,homePost)

// router.post('/comment/:postId', verifyToken, commantPost);
// router.post('/reportPost/:postId', verifyToken, reportPost);
//put 
router.put('/users/:userId',verifyToken,editUser)



//chat 

router.post('/send',verifyToken,chatSend);
router.get('/:senderId/:receiverId',verifyToken,receiver)
// router.get('/historyofChat/:senderId',verifyToken,chatHistory)
router.post('/chatHistories/:userId',verifyToken,chatHistories)
  

























export default router