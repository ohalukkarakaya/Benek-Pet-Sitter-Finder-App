import Event from "../../../../../models/Event/Event.js";

import getLightWeightEventInfoHelper from "../../../../../utils/getLightWeightEventInfoHelper.js";

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
                    searchedEvent.eventAdmin.toString() === userId
                    || searchedEvent.eventOrganizers.includes( userId )
                )
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

        const eventData = await getLightWeightEventInfoHelper( searchedEvent );

        return res.status( 200 ).json(
            {
                error: false,
                message: "Event info prepared succesfully",
                event: eventData
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