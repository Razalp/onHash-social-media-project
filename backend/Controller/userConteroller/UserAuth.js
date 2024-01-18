import User from "../../Model/UserModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import UserOtp from "../../Model/UserOtpModel.js";

// import repository from '../../repository/repository.js   


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:process.env.AUTH_EMAIL,
        pass:process.env.AUTH_PASS,
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


        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const saveUser = await newUser.save();


        const otpDocument = new UserOtp({
            email,
            otp,
            createdAt: new Date(),
            expireAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        await otpDocument.save();

        res.status(201).json(saveUser);
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


        // await otpDocument.remove();

        res.status(200).json({ message: 'OTP verification successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const login = async (req, res) => {
    try {
        console.log("loginnnnnnnnnnnn")
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcryptjs.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'mySecret', { expiresIn: '1h' });

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

export {
    signIn,
    login,
    otpVerify,
    signOut
}