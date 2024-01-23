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

//get
router.get('/userManagament' ,verifyToken,userGet)




//put
router.put('/edit/:id', verifyToken,editUser)
router.put('/block/:id',verifyToken,BlockUser)



//delete
router.delete('/userManagement/:id',verifyToken,deleteUser)


// router.get('/user-counts', async (req, res) => {
//   try {
//       const userCounts = {
//           totalUsers: await User.countDocuments({}),
//           upgradeCount: await User.countDocuments({ isUpgrade: true }),
//           adminCount: await User.countDocuments({ isAdmin: true }),
//           blockedCount: await User.countDocuments({ isBlocked: true }),
//       };

//       res.json(userCounts);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//   }
// });




export default router