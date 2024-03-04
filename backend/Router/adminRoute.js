import express from 'express'
const router=express.Router();
import User from '../Model/UserSchema.js'
import jwt from 'jsonwebtoken'
import {
    userGet,
    deleteUser,
    editUser,
    BlockUser,

} from '../Controller/adminController/AdminController.js'
import { verifyToken } from '../MiddelWare/verifyToken.js';
import { getReported ,deletePost } from '../Controller/adminController/ReporteManagamentController.js';

//get
router.get('/userManagament' ,verifyToken,userGet)

//put
router.put('/edit/:id', verifyToken,editUser)
router.put('/block/:id',verifyToken,BlockUser)

//delete
router.delete('/userManagement/:id',verifyToken,deleteUser)



router.get('/report',verifyToken,getReported)
router.delete('/postDelete/:postId', deletePost);








export default router