import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getEventByIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();

        if( !eventId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        const searchedEvent = await Event.findById( eventId );
        if( 
            !searchedEvent 
            || (
                searchedEvent.isPrivate
                && !(
                    searchedEvent.willJoin.includes( userId )
                    || searchedEvent.joined.includes( userId )
                   )
               )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Event not found"
                }
            );
        }

        searchedEvent.willJoin.forEach(
            async ( willJoinUserId ) => {
                const willJoinUser = await User.findById( willJoinUserId );
                const willJoinUserInfo = getLightWeightUserInfoHelper( willJoinUser );

                searchedEvent.willJoinUserList.push( willJoinUserInfo );
            }
        );

        if( 
            searchedEvent.willJoinUserList
                         .length === searchedEvent.willJoin
                                                  .length 
        ){
            delete searchedEvent.willJoinUserList;
        }

        searchedEvent.joined.forEach(
            async ( joinedUserId ) => {
                const joinedUser = await User.findById( joinedUserId );
                const joinedUserInfo = getLightWeightUserInfoHelper( joinedUser );

                searchedEvent.joinedUserList.push( joinedUserInfo );
            }
        )

        if( 
            searchedEvent.joinedUserList
                        .length === searchedEvent.joined
                                                .length 
        ){
            delete searchedEvent.joined;
        }

        const eventAdmin = await User.findById( searchedEvent.eventAdmin.toString() );
        if( 
            !eventAdmin 
            || eventAdmin.deactivation.isDeactive
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Event not found"
                }
            );
        }

        const eventAdminUserInfo = getLightWeightUserInfoHelper( eventAdmin );

        searchedEvent.eventAdmin = eventAdminUserInfo;

        searchedEvent.eventOrganizers.forEach(
            async ( organizerId ) => {
                const organizer = await User.findById( organizerId );
                const organizerInfo = getLightWeightUserInfoHelper( organizer );

                searchedEvent.organizerList.push( organizerInfo );
            }
        );

        if( searchedEvent.eventOrganizers.length ===  searchedEvent.organizerList.length ){
            delete searchedEvent.eventOrganizers;
        }

        if( searchedEvent.afterEvent.length > 0 ){
            const lastAfterEventObject = searchedEvent.afterEvent[ searchedEvent.afterEvent.length -1 ];
            delete lastAfterEventObject.comments;

            lastAfterEventObject.likes.forEach(
                async ( likedUserId ) => {
                    const likedUser = await User.findById( likedUserId.toString() );
                    const likedUserInfo = getLightWeightUserInfoHelper( likedUser );

                    lastAfterEventObject.likedUsers.push( likedUserInfo );
                }
            );

            if( lastAfterEventObject.likedUsers.length === lastAfterEventObject.likes.length ){
                delete lastAfterEventObject.likes;
            }

            const afterEventContentCreater = await User.findById( lastAfterEventObject.userId.toString() );
            const afterEventContentCreaterInfo = {

                userId: afterEventContentCreater._id
                                                .toString(),

                userProfileImg: afterEventContentCreater.profileImg
                                                        .imgUrl,

                username: afterEventContentCreater.userName,

                userFullName: `${
                        afterEventContentCreater.identity
                                                .firstName
                    } ${
                        afterEventContentCreater.identity
                                                .middleName
                    } ${
                        afterEventContentCreater.identity
                                                .lastName
                    }`.replaceAll( "  ", " ")
            }

            lastAfterEventObject.user = afterEventContentCreaterInfo;
            delete lastAfterEventObject.userId;

            searchedEvent.afterEvent = lastAfterEventObject;
            delete searchedEvent.eventAdminsParamGuid;
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "Event info prepared succesfully",
                event: searchedEvent
            }
        );

    }catch( err ){
        console.log("ERROR: getEventByIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getEventByIdController;