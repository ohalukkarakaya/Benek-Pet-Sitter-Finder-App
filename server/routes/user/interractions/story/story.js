import express from "express";
import User from "../../models/User.js";
import Story from "../../models/Story.js";
import dotenv from "dotenv";
import auth from "../../middleware/auth.js";
import { uploadStory } from "../../middleware/contentHandle/serverHandleStoryContent.js";
import s3 from "../../utils/s3Service.js";
import storyCommentEndpoints from "../storyComments.js";

dotenv.config();

const router = express.Router();

//create story
router.post(
    "/",
    auth,
    uploadStory,
    async (req, res) => {
        try{
            const contentUrl = req.cdnUrl;
            if(!contentUrl){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Content required"
                    }
                );
            }

            const user = await User.findById(req.user._id);
            if(!user){
                return res.status(404).json(
                    {
                        error: true,
                        message: "User couldn't found"
                    }
                );
            }

            if(
                !req.body.aboutId
                || !req.body.aboutType
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "Story must be about an event, pet or user"
                    }
                );
            }

            await new Story(
                {
                    userId: user._id.toString(),
                    about: {
                        id: req.body.aboutId,
                        aboutType: req.body.aboutType
                    },
                    desc: req.body.desc,
                    contentUrl: contentUrl
                }
            ).save().then(
                (story) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: `Story with id ${story._id}, created succesfully`,
                            storyId: story._id.toString(),
                            contentUrl: story.contentUrl,
                            storyExpireDate: story.expiresAt
                        }
                    );
                }
            ).catch(
                (error) => {
                    return res.status(500).json(
                        {
                            error: true,
                            message: "An error occured while saving story data"
                        }
                    );
                }
            );
        }catch(err){
            console.log("ERROR: create story - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//delete story
router.delete(
    "/",
    auth,
    async (req, res) => {
        try{
            const storyId = req.body.storyId;
            if(!storyId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "storyId is required"
                    }
                );
            }

            const story = await Story.findById( storyId );
            if(!story){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Story couldn't found"
                    }
                );
            }

            if(story.userId !== req.user._id.toString()){
                return res.status(401).json(
                    {
                        error: true,
                        message: "you can't delete this story"
                    }
                );
            }

            const contentUrl = story.contentUrl;
            const splitUrl = contentUrl.split('/');
            const contentName = splitUrl[splitUrl.length - 1];

            const deleteContentParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: `profileAssets/${req.user._id.toString()}/story/${contentName}`
            };

            s3.deleteObject(
                deleteContentParams,
                (error, data) => {
                  if(error){
                    console.log("error", error);
                    return res.status(500).json(
                      {
                        error: true,
                        message: "An error occured while deleting content"
                      }
                    );
                  }

                  story.deleteOne().then(
                    (_) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "Story deleted succesfully"
                            }
                        );
                    }
                  );
                }
              );

            
        }catch(err){
            console.log("ERROR: delete story - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

//like story
router.put(
    "/:storyId",
    auth,
    async (req, res) => {
        try{
            const storyId = req.params.storyId;
            if(!storyId){
                return res.status(400).json(
                    {
                        error: true,
                        message: "storyId is required"
                    }
                );
            }

            const story = Story.findById(storyId);
            if(!story){
                return res.status(404).json(
                    {
                        error: true,
                        message: "Story couldn't found"
                    }
                );
            }

            const likes = story.likes;

            const isAlreadyLiked = likes.find(
                userId => userId === req.user._id.toString()
            );

            if(isAlreadyLiked){
                story.likes = likes.filter(
                    userId => userId !== req.user._id.toString()
                );
            }else{
                story.likes.push(req.user._id.toString());
            }

            story.markModified("likes");
            story.save(
                (err) => {
                    if(err){
                      console.log("error", err);
                      return res.status(500).json(
                        {
                          error: true,
                          message: "An error occured while saving to database"
                        }
                      );
                    }
                  }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "Story liked or like removed succesfully"
                }
            );
        }catch(err){
            console.log("ERROR: like story - ", err);
            return res.status(500).json(
                {
                    error: true,
                    message: "Internal server error"
                }
            );
        }
    }
);

router.use("comments", storyCommentEndpoints);

export default router;