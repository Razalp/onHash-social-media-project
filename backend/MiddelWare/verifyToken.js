import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');


    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'mySecret');
        req.userId = decoded.userId;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};