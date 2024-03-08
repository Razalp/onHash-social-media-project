// Import your models
import User from '../../Model/UserSchema.js';
import Follow from '../../Model/FollowSchema.js';
import Notification from '../../Model/NotificationsSchema.js';
import { io } from '../../server.js'; 


const follow = async (req, res) => {
    try {
        const { userId } = req.params;
        const { user: currentUserId } = req.body;

        // Update the user's followers
        const currentUser = await Follow.findOneAndUpdate(
            { user: currentUserId },
            { $addToSet: { following: userId } },
            { new: true, upsert: true }
        );

        // Update the followed user's followers
        const followedUser = await Follow.findOneAndUpdate(
            { user: userId },
            { $addToSet: { followers: currentUserId } },
            { new: true, upsert: true }
        );

        // Create a notification for the followed user

        await createNotification(userId, `start follow you.`, currentUserId);


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

        // Update the user's following list
        const currentUser = await Follow.findOneAndUpdate(
            { user: currentUserId },
            { $pull: { following: userId } },
            { new: true }
        );

        // Update the unfollowed user's followers list
        const unfollowedUser = await Follow.findOneAndUpdate(
            { user: userId },
            { $pull: { followers: currentUserId } },
            { new: true }
        );

        // Create a notification for the unfollowed user
        await createNotification(userId, `unfollowed you.`, currentUserId);



        res.json({ currentUser, unfollowedUser });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function createNotification(userId, message, link) {
    try {
        const notification = new Notification({
            user: userId,
            message,
            link
        });
        await notification.save();
        io.emit(`notifications_${userId}`, notification); // Emit notification to the specific user
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}


const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        const {currentUserId } = req.body;
   
        


        const userData = await Follow.findOne({ user: userId }).populate('user');

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const followers = userData.followers;
        const following = userData.following;

        const followersData = await User.find({ _id: { $in: followers } });
        const followingData = await User.find({ _id: { $in: following } });

        const isFollowed = followers.includes(currentUserId.toString());
  
        const followersCount = followers.length;
        const followingCount = following.length;



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


const mutualFriends = async (req, res) => {
    try {
  
        const { currentUserId, userId } = req.params;
        const followers1 = await Follow.findOne({ user: currentUserId }).select('followers');
        const followers2 = await Follow.findOne({ user: userId }).select('followers');
        const mutualFriends = followers1.followers.filter(follower =>
            followers2.followers.includes(follower)
        );

        const mutualFriendsDetails = await User.find({ _id: { $in: mutualFriends } });
   
        res.json(mutualFriendsDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export { follow, unFollow ,getFollowers ,UsergetFollowers,mutualFriends };
