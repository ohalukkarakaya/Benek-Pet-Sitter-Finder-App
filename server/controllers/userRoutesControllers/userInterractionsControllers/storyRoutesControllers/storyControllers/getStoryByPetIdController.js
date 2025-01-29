import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";
import Pet from "../../../../../models/Pet.js";
import getLightWeightPetInfoHelper from "../../../../../utils/getLightWeightPetInfoHelper.js";
import Event from "../../../../../models/Event/Event.js";
import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";


const getStoryByPetIdController = async ( req, res ) => {
    try{
        const petId = req.params.petId.toString();
        if( !petId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const story = await Story.find(
            {
                "about.id": { $eq: petId },
            }
        ).lean();;

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

        const pet = await Pet.findById( petId );
        const petInfo = await getLightWeightPetInfoHelper( pet );

        for( let storyObject of story ){
            storyObject.about.taged = petInfo;
            delete storyObject.about.id;

            const sharedUser = await User.findById( storyObject.userId.toString() );
            const userInfo = getLightWeightUserInfoHelper( sharedUser );

            storyObject.user = userInfo;

            let firstFiveOfLikeLimit = 5;
            if( storyObject.likes.length < 5 ){
                firstFiveOfLikeLimit = storyObject.likes.length;
            }

            storyObject.firstFiveLikedUser = [];
            for( let i = 0; i < firstFiveOfLikeLimit; i++ ) {
                const likedUser = await User.findById( storyObject.likes[ i ].toString());
                const likedUserInfo = getLightWeightUserInfoHelper( likedUser );

                storyObject.firstFiveLikedUser.push( likedUserInfo );
            }

            storyObject.didUserLiked = storyObject.likes.includes( req.user._id.toString() );

            storyObject.likeCount = storyObject.likes.length;

            delete storyObject.likes;

            const lastComment = storyObject.comments.length > 0
                ? storyObject.comments[storyObject.comments.length - 1]
                : {};

            const replyCount = lastComment.replies !== undefined && lastComment.replies !== null
                ? lastComment.replies.length
                : 0;
            let lastReply = lastComment.replies !== undefined && lastComment.replies !== null && lastComment.replies.length > 0
                ? lastComment.replies[lastComment.replies.length - 1]
                : {};

            if (lastReply.likes) {
                lastReply.likeCount = lastReply.likes.length;
                delete lastReply.likes;
            }

            if( lastComment ){
                let lastThreeRepliedUsers = [];
                if (lastComment.replies !== undefined && lastComment.replies !== null && lastComment.replies.length > 0) {
                    const uniqueUsers = new Set();
                    for (let i = 0; i < lastComment.replies.length; i++) {
                        if (uniqueUsers.size >= 3) break;

                        const reply = lastComment.replies[i];
                        if (reply) {
                            const repliedUser = await User.findById(reply.userId.toString());
                            const repliedUserInfo = getLightWeightUserInfoHelper(repliedUser);

                            if (!uniqueUsers.has(reply.userId.toString())) {
                                uniqueUsers.add(reply.userId.toString());
                                lastThreeRepliedUsers.push(repliedUserInfo);
                            }
                        }
                    }
                }

                lastComment.lastReply = lastReply;
                lastComment.replyCount = replyCount;
                lastComment.likeCount = lastComment !== undefined && lastComment != null && lastComment.likes !== undefined && lastComment.likes !== null
                    ?   lastComment.likes.length
                    : 0;

                delete lastComment.replies;

                lastComment.lastThreeRepliedUsers = lastThreeRepliedUsers;
                storyObject.lastComment = lastComment;
            }

            storyObject.commentCount = storyObject.comments.length;

            delete storyObject.comments;
            delete storyObject.__v;
            delete storyObject.updatedAt;

        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "Story List Prepared Succesfully",
                stories: story
            }
        );

    }catch( err ){
        console.log("ERROR: getStoryByPetIdController - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default getStoryByPetIdController;