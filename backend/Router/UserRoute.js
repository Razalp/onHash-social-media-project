import express from 'express'
import {signIn,login,otpVerify,signOut} from '../Controller/userConteroller/UserAuth.js ';
// import verifyToken from '../MiddelWare/verifyToken';
const router=express.Router();


router.post('/signIn',signIn)
router.post('/logIn',login)
router.post('/verify-otp',otpVerify)
router.post('/sign-out',signOut)


export default router