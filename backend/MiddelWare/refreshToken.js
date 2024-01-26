import jwt from 'jsonwebtoken';

const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.header('Authorization');

    if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized - No refresh token provided' });
    }

    try {
        const decoded = jwt.verify(refreshToken, 'refreshSecret');

        const newRefreshToken = jwt.sign({ userId: decoded.userId }, 'refreshSecret', { expiresIn: '1h' });

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Unauthorized - Invalid refresh token' });
    }
};

export default verifyRefreshToken;

