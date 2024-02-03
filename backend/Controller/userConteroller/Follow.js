// Import your models
import User from '../../Model/UserModel.js';
import Follow from '../../Model/FollowSchema.js';

// Follow user
const follow = async (req, res) => {
    try {
        const { userId } = req.params;
        const { user: currentUserId } = req.body;


        const currentUser = await Follow.findOneAndUpdate(
            { user: currentUserId },
            { $addToSet: { following: userId } },
            { new: true, upsert: true }
        );


        const followedUser = await Follow.findOneAndUpdate(
            { user: userId },
            { $addToSet: { followers: currentUserId } },
            { new: true, upsert: true }
        );

        res.json({ currentUser, followedUser });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const unFollow = async (req, res) => {
    try {
        const { userId } = req.params;
        const { user: currentUserId } = req.body;


        const currentUser = await Follow.findOneAndUpdate(
            { user: currentUserId },
            { $pull: { following: userId } },
            { new: true }
        );


        const unfollowedUser = await Follow.findOneAndUpdate(
            { user: userId },
            { $pull: { followers: currentUserId } },
            { new: true }
        );

        res.json({ currentUser, unfollowedUser });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const {currentUserId } = req.body;
        console.log(currentUserId)
        


        const userData = await Follow.findOne({ user: userId }).populate('user');

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followers = userData.followers;
        const following = userData.following;

        const followersData = await User.find({ _id: { $in: followers } });
        const followingData = await User.find({ _id: { $in: following } });

        const isFollowed = followers.includes(currentUserId.toString());
        console.log(isFollowed)
        const followersCount = followers.length;
        const followingCount = following.length;

            console.log(followersCount);
            console.log(followersCount);

        res.json({ userData, followersData,isFollowed, followingData,followersCount,followingCount});
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const UsergetFollowers= async (req, res) => {
    try {
        const { userId } = req.params;
        

        const userData = await Follow.findOne({user:userId}).populate('user')

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followers = userData.followers;
        const following = userData.following; 
        const followersData = await User.find({ _id: { $in: followers } });
        const followingData = await User.find({ _id: { $in: following } });
        res.json({ userData ,followersData,followingData });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export { follow, unFollow ,getFollowers ,UsergetFollowers };
