import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import Event from "../../../../../models/Event/Event.js";
import Pet from "../../../../../models/Pet.js";

import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";
import getLightWeightPetInfoHelper from "../../../../../utils/getLightWeightPetInfoHelper.js";
import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

const getRecomendedStoryListController = async ( req, res ) => {
    try{

        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const user = await User.findById( userId );
        const followingUsers = user.followingUsersOrPets
                                   .filter(
                                        followingObject =>
                                            followingObject.type === "user"
                                    );

        const followingPets = user.followingUsersOrPets
                                  .filter(
                                        followingObject =>
                                            followingObject.type === "pet"
                                  );

        const relatedEvents = await Event.find(
            {
                $or: [
                    { eventAdmin: userId },
                    { eventOrganizers: { $in: [ userId ] } },
                    { willJoin: { $in: [ userId ] } },
                    { joined: { $in: [ userId ] } }
                ]
            }
        );

        const combinedIds = [
            ...followingUsers.map( 
                                obj => 
                                    obj.followingId.toString() 
                              ),

            ...followingPets.map( 
                                obj => 
                                    obj.followingId.toString() 
                            ),

            ...relatedEvents.map( 
                                obj => 
                                    obj.followingId.toString() 
                             )
        ];

        const stories = await Story.find(
            {
                $and:[
                    {
                        userId: { $ne: req.user._id.toString() }
                    },
                    {
                        $or: [
                            { userId: { $in: combinedIds } },
                            { "about.id": { $in: combinedIds } }
                        ]
                    }
                ]
            }
        ).skip( skip )
         .limit( limit )
         .lean();

        if( 
            !stories
            || stories.length <= 0
        ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "No Story Found"
                            }
                      );
        }

        for(
            let storyObject
            of stories
        ){
            const sharedUser = await User.findById( 
                                                storyObject.userId
                                                           .toString() 
                                          );

            const userInfo = getLightWeightUserInfoHelper( sharedUser );
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
                        const petInfo = getLightWeightPetInfoHelper( tagedPet );
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
                break;
            }

            storyObject.likeCount = storyObject.likes
                                               .length;
            delete storyObject.likes;

            const lastComment = storyObject.comments
                                           .pop();

            if( lastComment ){
                delete lastComment.replies;
                delete lastComment.replies;

                storyObject.lastComment = lastComment;
            }
            
            storyObject.commentCount = storyObject.comments
                                                  .length;
            delete storyObject.comments;
            delete storyObject.__v;
            delete storyObject.updatedAt;

        }

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "Story List Prepared Succesfully",
                            stories: stories
                        }
                  );

    }catch( err ){
        console.log( "ERROR: getStoryByUserIdController - ", err );
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: "Internal server error"
                        }
                  );
    }
}

export default getRecomendedStoryListController;