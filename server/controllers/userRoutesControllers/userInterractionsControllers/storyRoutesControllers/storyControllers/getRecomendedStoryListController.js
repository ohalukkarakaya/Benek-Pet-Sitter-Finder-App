import User from "../../../../../models/User.js";
import Story from "../../../../../models/Story.js";
import Event from "../../../../../models/Event/Event.js";

const getRecomendedStoryListController = async ( req, res ) => {
    try{

        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const user = await User.findById( userId );
        const followingUsers = user.followingUsersOrPets.filter(
            followingObject =>
                followingObject.type === "user"
        );

        const followingPets = user.followingUsersOrPets.filter(
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
            ...followingUsers.map( obj => obj._id.toString() ),
            ...followingPets.map( obj => obj._id.toString() ),
            ...relatedEvents.map( obj => obj._id.toString() )
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
         .limit( limit );

        if( 
            !stories
            || stories.length <= 0
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Story Found"
                }
            );
        }

        stories.forEach(
            async ( story ) => {
                const sharedUser = await User.findById( story.userId.toString() );
                const userInfo = {
                        
                    userId: sharedUser._id
                                      .toString(),
                    userProfileImg: sharedUser.profileImg
                                              .imgUrl,
                    username: sharedUser.userName,
                    userFullName: `${
                            sharedUser.identity
                                      .firstName
                        } ${
                            sharedUser.identity
                                      .middleName
                        } ${
                            sharedUser.identity
                                      .lastName
                        }`.replaceAll( "  ", " ")
                }

                story.user = userInfo;
                delete story.userId;

                story.likeCount = story.$assertPopulatedlikes.length;
                delete story.likes;

                const lastComment = story.comments.pop();
                delete lastComment.replies;

                story.lastComment = lastComment;
                story.commentCount = story.comments.length;
                delete story.comments;
            }
        );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Story List Prepared Succesfully",
                stories: stories
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

export default getRecomendedStoryListController;