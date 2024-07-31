import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import Pet from "../../../../../models/Pet.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../../../../utils/getLightWeightPetInfoHelper.js";
import Event from "../../../../../models/Event/Event.js";
import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

const getStoryByUserIdController = async ( req, res ) => {
    try{
        const userId = req.params.userId.toString() != undefined
                       && req.params.userId.toString() != null
                       
                            ? req.params.userId.toString()
                            : req.user._id.toString();


        const user = await User.findById( userId );
        if(
            userId !== req.user._id.toString()
            && (
                user.deactivation.isDeactive
                || user.blockedUsers.includes( 
                                        req.user._id.toString() 
                                    )
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

        const userInfo = getLightWeightUserInfoHelper( user );

        for(
            let storyObject
            of story
        ){
            storyObject.user = userInfo;
            delete storyObject.userId;

            switch(
                storyObject.about
                           .aboutType
            ){
                case "pet":
                    const tagedPet = await Pet.findById(
                                                    storyObject.about
                                                               .id
                                                               .toString()
                                            );

                    if( tagedPet ){
                        const petInfo = await getLightWeightPetInfoHelper( tagedPet );
                        storyObject.about
                                   .taged = petInfo;

                        delete storyObject.about
                                          .id;
                    }
                break;

                case "user":
                    const tagedUser = await User.findById(
                                                    storyObject.about
                                                               .id
                                                               .toString()
                                                 );

                    if( tagedUser ){
                        const tagedUserInfo = getLightWeightUserInfoHelper( tagedUser );
                        storyObject.about
                                   .taged = tagedUserInfo;

                        delete storyObject.about
                                          .id;
                    }
                break;

                case "event":
                    const tagedEvent = await Event.findById(
                                                      storyObject.about
                                                                 .id
                                                                 .toString()
                                                  );

                    if( tagedEvent ){
                        const tagedEventInfo = getLightWeightEventInfoHelper( tagedEvent );
                        storyObject.about
                                   .taged = tagedEventInfo;

                        delete storyObject.about
                                          .id;
                    }
            }

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

            const lastComment = storyObject.comments.pop();

            if( lastComment ){
                delete lastComment.replies;
                delete lastComment.replies;

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