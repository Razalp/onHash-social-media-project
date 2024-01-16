import User from "../../Model/UserModel.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// import repository from '../../repository/repository.js'
const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const SALT_ROUNDS = 10; 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });
 
        res.setHeader('Authorization', 'Bearer ' + token);// seting token in header
 
        res.status(200).json({ token, userId: user._id });
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
 }

export { 
    signIn,
    login
 }