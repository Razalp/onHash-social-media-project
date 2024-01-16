import express from 'express'
import {signIn} from '../Controller/userConteroller/UserAuth.js ';
const router=express.Router();


router.post('/signIn',signIn)


export default router