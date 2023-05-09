import Event from "../../../../../models/Event/Event.js";

const getAfterEventListController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const eventId = req.params.eventId.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;
        if( !eventId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        var searchedEvent = await Event.findById( eventId )
                                         .select( 'afterEvent' )
                                         .slice( 'afterEvent', [ skip, limit ] )
                                         .exec();

        if( skip === 0 ){
            const eventWithUsersAfterEvent = await Event.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(eventId) } },
                { $unwind: "$afterEvent" },
                { $match: { "afterEvent.userId": userId } },
                { $sort: { "afterEvent.createdAt": -1 } },
                { $skip: skip },
                { $limit: limit },
                { 
                  $project: { 
                    "afterEvent.comments.replies": 0, 
                    "afterEvent.comments": { 
                      $slice: [ "$afterEvent.comments", 0, -1 ] 
                    }, 
                    "_id": 0 
                  } 
                }
              ]).exec();

              if( 
                eventWithUsersAfterEvent.afterEvent
                                         .length >= limit 
              ){

                searchedEvent = eventWithUsersAfterEvent;

              }else{

                searchedEvent.afterEvent = searchedEvent.afterEvent.filter(
                    afterEventObject =>
                            afterEventObject.userId.toString() !== userId
                );
                searchedEvent.afterEvent = [...searchedEvent.afterEvent, ...eventWithUsersAfterEvent.afterEvent];
              }
        }

        if(
            !searchedEvent 
            || (
                searchedEvent.isPrivate
                && (
                    searchedEvent.eventAdmin !== userId
                    && !(
                            searchedEvent.eventOrganizers
                                         .includes( userId )
                        )
                    && !(
                        searchedEvent.willJoin
                                     .includes( userId )
                       )
                    && !(
                        searchedEvent.joined
                                     .includes( userId )
                       )
                )
            )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Event Not Found"
                }
            );
        }

        searchedEvent.afterEvent.forEach(
            ( afterEventObject ) => {
                const lastComment = afterEventObject.comments.pop();
                delete lastComment.replies;

                afterEventObject.lastComment = lastComment;
                delete afterEventObject.comments;
            }
        );

        const usersAfterEventObject = searchedEvent.afterEvent.filter(
            afterEventObject =>
                afterEventObject.userId.toString() !== userId
        ).sort(
            ( a, b ) => 
                b.createdAt -a.createdAt
        );

        const otherAfterEvents = searchedEvent.afterEvent.filter(
            afterEventObject =>
                afterEventObject.userId.toString() === userId
        ).sort(
            ( a, b ) => 
                b.createdAt -a.createdAt
        );

        const resultList = [...usersAfterEventObject, ...otherAfterEvents];

        return res.status( 200 ).json(
            {
                error: false,
                message: "After event contents prepared succesfully",
                afterEventContents: resultList
            }
        );
    }catch( err ){
        console.log("ERROR: getAfterEventListController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error",
            }
        );
    }
}

export default getAfterEventListController;