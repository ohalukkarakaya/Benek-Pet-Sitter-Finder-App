import express from "express";
import User from "../../models/User.js";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";

dotenv.config();

const router = express.Router();

router.put(
    "/followUser/:followingUserId",
    auth,
    async (req, res) => {
        try{
            const followingUserId = req.params.followingUserId;
            if(!followingUserId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Id of the user which you want to follow is required"
                    }
                );
            }

            const user = await User.findById( req.user._id );
            if(!user){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User not found"
                    }
                );
            }
            const userFollowings = user.followingUsersOrPets;

            const followingUser = await new User.findById( followingUserId );
            if(!followingUser){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User which you want to follow doesn't exists"
                    }
                );
            }
            const followingUserFollowings = followingUser.followers;


            const isAlreadyFollowingUserSide = userFollowings.find(
                followObject =>
                    followObject.followingId === followingUserId.toString()
            );
            const isAlreadyFollowingTargetSide = followingUserFollowings.find(
                followerId =>
                    followerId === req.user._id.toString()
            );

            if(
                !isAlreadyFollowingUserSide && isAlreadyFollowingTargetSide
                || isAlreadyFollowingUserSide && !isAlreadyFollowingTargetSide
            ){
                followingUser.followers = followingUserFollowings.filter(
                    followerId =>
                        followerId !== req.user._id.toString()
                );
                followingUser.markModified("followers");
                followingUser.save(
                    (err) => {
                        if(err){
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "ERROR: while saving following user"
                                }
                            );
                        }
                    }
                );

                user.followingUsersOrPets = userFollowings.filter(
                    followObject =>
                        followObject.followingId !== followingUserId.toString()
                );
                user.markModified("followingUsersOrPets");
                user.save(
                    (err) => {
                        if(err){
                            return res.status(500).json(
                                {
                                    error: true,
                                    message: "ERROR: while saving user"
                                }
                            );
                        }
                    }
                );

                return res.status(500).json(
                    {
                        error: true,
                        message: "pet unfollowed because there was an issue with records. Please re try to follow"
                    }
                );
            }

            const isAlreadyFollowing = isAlreadyFollowingUserSide && isAlreadyFollowingTargetSide;

            if(isAlreadyFollowing){
                followingUser.followers = followingUserFollowings.filter(
                    followerId =>
                        followerId !== req.user._id.toString()
                );

                user.followingUsersOrPets = userFollowings.filter(
                    followObject =>
                        followObject.followingId !== followingUserId.toString()
                );
            }else{
                followingUser.followers.push( req.user._id );

                user.followingUsersOrPets.push(
                    {
                        type: "user",
                        followingId: followingUserId.toString()
                    }
                );
            }

            followingUser.markModified("followers");
            followingUser.save(
                (err) => {
                    if(err){
                        return res.status(500).json(
                            {
                                error: true,
                                message: "ERROR: while saving following user"
                            }
                        );
                    }
                }
            );

            user.markModified("followingUsersOrPets");
            user.save(
                (err) => {
                    if(err){
                        return res.status(500).json(
                            {
                                error: true,
                                message: "ERROR: while saving user"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "user followed or unfollowed succesfully"
                }
            );
        }catch(err){
            console.log("error - follow user", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//TO DO: create story
//TO DO: plan meeting event
//TO DO: plan joining to meeting event
//TO DO: give star to care giver
//TO DO: plan care give for a pet
//TO DO: plan care give missions
//TO DO: upload care give mission
//TO DO: approve care give mission

export default router;