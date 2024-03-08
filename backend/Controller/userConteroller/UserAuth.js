import User from "../../Model/UserSchema.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import UserOtp from "../../Model/UserOtpSchema.js";
import path from 'path';
import Post from '../../Model/PostSchema.js'
import TempUserSchema from "../../Model/TempUserSchema.js";


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:'razalp0012300@gmail.com',
        pass:'wlmdruvemoajrkbi',
    },
});

const generateOTP = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric',
    });
};

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: 'razalp0012300@gmail.com',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP for registration is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
};



const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const SALT_ROUNDS = 10;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const otp = generateOTP();
        await sendOTPEmail(email, otp);
        
        // Save user in temporary collection
        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
        const tempUser = new TempUserSchema({
            username,
            email,
            password: hashedPassword,
            otp, // include otp field
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), 
        });
        await tempUser.save();

        const otpDocument = new UserOtp({
            email,
            otp,
            createdAt: new Date(),
            expireAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await otpDocument.save();

        res.status(201).json({ message: 'User signed up successfully. Please verify OTP.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const otpVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const otpDocument = await UserOtp.findOne({ email, otp });

        if (!otpDocument || otpDocument.expireAt < new Date()) {
            return res.status(401).json({ error: 'Invalid OTP or expired' });
        }


        const tempUser = await TempUserSchema.findOne({ email });
        const newUser = new User({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
        });
        await newUser.save();

  
        await TempUserSchema.deleteOne({ email });

        res.status(200).json({ message: 'OTP verification successful. User account created.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found with this email' });
        }

        const newOtp = generateOTP();


        const otpDocument = await UserOtp.findOneAndUpdate(
            { email },
            { otp: newOtp, createdAt: new Date(), expireAt: new Date(Date.now() + 60 * 1000) },
            { new: true }
        );

        await sendOTPEmail(email, newOtp);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        console.log("hello")

        if (!existingUser) {
            return res.status(404).json({ error: 'User not found with this email' });
        }

        const newOtp = generateOTP();

        const otpDocument = new UserOtp({
            email,
            otp: newOtp,
            createdAt: new Date(),
            expireAt: new Date(Date.now() + 5 * 60 * 1000), // Set OTP expiration time
        });

        await otpDocument.save();

        await sendOTPEmail(email, newOtp);

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Reset Password Route
const    SALT_ROUNDS = 10;
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const otpDocument = await UserOtp.findOne({ email, otp });

        if (!otpDocument || otpDocument.expireAt < new Date()) {
            return res.status(401).json({ error: 'Invalid OTP or expired' });
        }

        // OTP is valid, now reset the password
        const hashedPassword = await bcryptjs.hash(newPassword, SALT_ROUNDS);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });


        await UserOtp.deleteOne({ email, otp });
        console.log("changed")

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


    const login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            if (user.isBlocked) {
                return res.status(401).json({ error: 'User is blocked' });
            }

            const passwordMatch = await bcryptjs.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id,isAdmin:user.isAdmin }, 'mySecret');

            // res.setHeader('Authorization', 'Bearer ' + token);
            res.status(200).json({ token, userId: user._id ,user});

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

const signOut = async (req, res) => {
    try {
        res.status(200).json({ message: "Sign-out successfull" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


const editProfile= async (req, res) => {
    try {
        const { username, bio, profilePicture } = req.body;
        const userId = req.user.id; 

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        existingUser.username = username || existingUser.username;
        existingUser.bio = bio || existingUser.bio;
        existingUser.profilePicture = profilePicture || existingUser.profilePicture;

    
        const updatedUser = await existingUser.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteProfile=async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user has a profile picture
      if (!user.profilePicture) {
        return res.status(400).json({ message: 'User does not have a profile picture' });
      }
  
      // Delete profile picture
      user.profilePicture = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

const updateProfile = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.userId;
        const { bio, username } = req.body;

        const updateFields = {};

        if (bio) {
            updateFields.bio = bio;
        }

        if (username) {
            updateFields.username = username;
        }

        // Check if req.file is available (image selected)
        if (req.file) {
            const imagePath = path.join(req.file.filename);
            updateFields.profilePicture = imagePath;
        }

        await User.findByIdAndUpdate(userId, { $set: updateFields });

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



    const editUser = async (req, res) => {
        const userId = req.params.userId;
    
        try {
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            if (req.body.username) user.username = req.body.username;
            if (req.body.email) user.email = req.body.email;
            if (req.body.password) user.password = req.body.password;
            if (req.body.bio) user.bio = req.body.bio;
            if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;
            if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;
            if (req.body.isUpgrade !== undefined) user.isUpgrade = req.body.isUpgrade;
            if (req.body.isBlocked !== undefined) user.isBlocked = req.body.isBlocked;
    

            const updatedUser = await user.save();
    
            res.status(200).json(updatedUser);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    const changePassword=async (req,res)=>{
        try{
            const {userId} =req.body.params
            if(!userId){
                return res.json("there is no user")
            }
            const user=User.findById({userId});
            if (req.body.password) user.password = req.body.password;

            const updatedUser = await user.save();
    
            
    
        }catch(error){

            res.status(500).json({message:'Internal Server Error'})
        }
    }
    


    const uploadPost = async (req, res) => {
        try {
            if (!req.userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
    
            const userId = req.userId;
            const { caption } = req.body;
    
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: 'No files provided' });
            }
    
            const imagePaths = req.files.map(file =>file.filename);
    

            const newPost = new Post({
                user: userId,
                image: imagePaths,
                caption,
                likes: [],
                comments: [],
            });
    
          
            await newPost.save();
    
            res.status(200).json({ message: 'Post uploaded successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };



    const userDashBoard=async (req, res) => {
        try {
            const userCounts = {
                totalUsers: await User.countDocuments({}),
                upgradeCount: await User.countDocuments({ isUpgrade: true }),
                adminCount: await User.countDocuments({ isAdmin: true }),
                blockedCount: await User.countDocuments({ isBlocked: true }),
            };
      
            res.json(userCounts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
      };

      const getProfile= async (req, res) => {
        try {
          const { userId } = req.params;
          const user = await User.findById(userId);
      
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      

          res.json({
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            bio: user.bio,
            followers: user.followers,
            profilePicture: user.profilePicture,
            following: user.following,
            isAdmin: user.isAdmin,
            isUpgrade: user.isUpgrade,
            isBlocked: user.isBlocked,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      };
      



export {
    signIn,
    login,
    otpVerify,
    signOut,
    resendOTP,
    editProfile,
    updateProfile,
    editUser,
    uploadPost,
    userDashBoard,
    getProfile,
    deleteProfile,
    changePassword,
    forgotPassword, resetPassword 
}