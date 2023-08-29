import Event from "../../../../../models/Event/Event.js";

import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

const getEventsByUserIdController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString()
        const events = await Event.find(
            {
                $or: [
                    {
                        eventAdmin: userId
                    },
                    {
                        eventOrganizers: {
                            $in: [
                                userId
                            ]
                        }
                    },
                    {
                        willJoin: {
                            $in: [
                                userId
                            ]
                        }
                    },
                    {
                        joined: {
                            $in: [
                                userId
                            ]
                        }
                    }
                ]
            }
        ).lean();

        if( events.length <= 0 ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "No Event Found"
                            }
                       );
        }

        let preparedEventList = [];

        for(
            let releatedEvent
            of events
        ){
            const preparedEvent = await getLightWeightEventInfoHelper( releatedEvent );

            preparedEventList.push( preparedEvent );
        }

        return res.status( 200 ).json(
            {
                error: false,
                message: "List of Events Which Releated to You Had Prepared Successfully",
                eventCount: preparedEventList.length,
                events: preparedEventList
            }
        );

    }catch( err ){
        console.log("ERROR: getEventsByUserIdController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default getEventsByUserIdController;