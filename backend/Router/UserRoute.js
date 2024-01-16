import express from 'express'
import {signIn,login} from '../Controller/userConteroller/UserAuth.js ';
const router=express.Router();


router.post('/signIn',signIn)
router.post('/logIn',login)


export default router