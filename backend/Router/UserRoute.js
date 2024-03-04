import express from 'express'
import { verifyToken } from '../MiddelWare/verifyToken.js';

import verifyRefreshToken from '../MiddelWare/refreshToken.js';
import upload from '../MiddelWare/multerConfig.js';
const router=express.Router();
import {
    signIn, login ,otpVerify, signOut, resendOTP, updateProfile ,editUser,uploadPost,userDashBoard,getProfile ,changePassword,forgotPassword, resetPassword 
} from '../Controller/userConteroller/UserAuth.js ';

import {
  myPost ,searchUser ,LikePost,comments ,report,getPostDetails ,homePost,stories,getStories,deletePost,randomUser,userActivties
} from '../Controller/userConteroller/UserPostController.js'

import { follow ,unFollow ,getFollowers ,UsergetFollowers ,mutualFriends } from '../Controller/userConteroller/FollowController.js'
import { chatSend, receiver , chatHistories ,notificationsOfUser,deleteNotification } from '../Controller/userConteroller/ChatingController.js'
import { deleteProfile } from '../Controller/userConteroller/UserAuth.js';


router.get('/user-counts',verifyToken, userDashBoard)
router.get('/userActivties',verifyToken,userActivties)
router.get('/get-profile/:userId',verifyToken,getProfile)
router.get('/my-post/:userId', verifyToken, myPost);
router.delete('/post/delete/:postId',verifyToken,deletePost)

router.get('/serachUser-post/:userId', verifyToken, myPost);
router.get('/searchUser',verifyToken,searchUser)
router.get('/notifications/:userId', verifyToken, notificationsOfUser)
router.delete('/notifications/:notificationId',verifyToken,deleteNotification)




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

router.get('/random-users',verifyToken,randomUser)

// Route to handle forgot password request
router.post('/forgot-password', forgotPassword);

// Route to handle password reset request
router.post('/reset-password', resetPassword);

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

router.post('/send', verifyToken, upload.single('image'), chatSend);
router.get('/:senderId/:receiverId',verifyToken,receiver)
// router.get('/historyofChat/:senderId',verifyToken,chatHistory)
router.post('/chatHistories/:userId',verifyToken,chatHistories)
  

























export default router