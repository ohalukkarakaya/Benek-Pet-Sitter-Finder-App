import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";

const getStoryByUserIdController = async ( req, res ) => {
    try{
        const userId = req.params.userId.toString() || req.user._id.toString();

        const user = await User.findById( userId );
        if(
            userId !== req.user._id.toString()
            && (
                user.deactivation.isDeactive
                || user.blockedUsers.includes( req.user._id.toString() )
            )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User Not Found"
                }
            );
        }

        const story = await Story.find(
            {
                userId: userId
            }
        );
        if( 
            !story
            || story.length <= 0
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Story Found"
                }
            );
        }

        const userInfo = {
                        
            userId: user._id
                        .toString(),
            userProfileImg: user.profileImg
                                .imgUrl,
            username: user.userName,
            userFullName: `${
                    user.identity
                        .firstName
                } ${
                    user.identity
                        .middleName
                } ${
                    user.identity
                        .lastName
                }`.replaceAll( "  ", " ")
        }

        story.forEach(
            ( storyObject ) => {
                storyObject.user = userInfo;
                delete storyObject.userId;

                storyObject.likeCount = storyObject.likes.length;
                delete storyObject.likes;

                const lastComment = storyObject.comments.pop();
                delete lastComment.replies;

                storyObject.lastComment = lastComment;
                storyObject.commentCount = storyObject.comments.length;
                delete storyObject.comments;
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Story List Prepared Succesfully",
                stories: story
            }
        );
        
    }catch( err ){
        console.log("ERROR: getStoryByUserIdController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getStoryByUserIdController;