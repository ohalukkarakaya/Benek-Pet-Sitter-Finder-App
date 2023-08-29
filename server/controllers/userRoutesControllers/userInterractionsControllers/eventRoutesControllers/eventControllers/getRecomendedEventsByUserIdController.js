import Event from "../../../../../models/Event/Event.js";
import User from "../../../../../models/User.js";

import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

const getRecomendedEventsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        let limit = parseInt( req.params.limit ) || 15;
        let skip = parseInt( req.params.skip ) || 0

        const user = await User.findById( userId );
        if( !user ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "User Not Found"
                            }
                      );
        }

        const followingUserIds = user.followingUsersOrPets
                                     .filter(
                                        followingUserObject => 
                                            followingUserObject.type === "user"
                                      ).map(
                                        followingUserObject => 
                                            followingUserObject.followingId
                                      );

        const query = {
            $or: [
                {
                    $and: [
                        { eventAdmin: { $in: followingUserIds } },
                        { eventAdmin: { $ne: userId } }
                    ]
                },
                {
                    $and: [
                        { eventOrganizers: { $in: followingUserIds } },
                        { eventOrganizers: { $nin: followingUserIds } }
                    ]
                },
                {
                    willJoin: { $in: followingUserIds }
                }
            ]
        };

        const eventsReleatedToFollowingUsers = await Event.find( query )
                                                          .skip( skip )
                                                          .limit( limit );

        const totalEventCount = await Event.countDocuments( query );

        const preparedEventsPromises = eventsReleatedToFollowingUsers.map(
            async releatedEvent => {
                const preparedEvent = await getLightWeightEventInfoHelper( releatedEvent );
                return preparedEvent;
            }
        );

        const recomendedEvents = await Promise.all( preparedEventsPromises );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "List of Recomended Events Which Releated to Users who You Follow Had Prepared Successfully",
                            totlaEventCount: totalEventCount,
                            eventCount: recomendedEvents.length,
                            recomendedEvents: recomendedEvents
                        }
                  );
    }catch( err ){
        console.log( "ERROR: getRecomendedEventsByUserIdController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
           );
    }
}

export default getRecomendedEventsByUserIdController;