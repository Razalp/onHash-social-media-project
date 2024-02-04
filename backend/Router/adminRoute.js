import express from 'express'
const router=express.Router();
import User from '../Model/UserModel.js'
import jwt from 'jsonwebtoken'
import {
    userGet,
    deleteUser,
    editUser,
    BlockUser
} from '../Controller/adminController/AdminController.js'
import { verifyToken } from '../MiddelWare/verifyToken.js';
import { getReported } from '../Controller/adminController/ReporteManagament.js';

//get
router.get('/userManagament' ,verifyToken,userGet)

//put
router.put('/edit/:id', verifyToken,editUser)
router.put('/block/:id',verifyToken,BlockUser)

//delete
router.delete('/userManagement/:id',verifyToken,deleteUser)



router.get('/report',verifyToken,getReported)







export default router