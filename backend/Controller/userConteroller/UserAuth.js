import User from "../../Model/UserModel.js";
import bcryptjs from 'bcryptjs';

const signIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const SALT_ROUNDS = 10; 
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

export { 
    signIn,
 }