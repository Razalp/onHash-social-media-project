import User from '../Model/UserSchema.js'
async function findByEmail(email) {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (error) {
        throw error;
    }
}

async function findById(userId) {
    try {
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findByEmail,
    findById,
};