import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import dotenv from "dotenv";

dotenv.config();

const createEventController = async (req,res) => {
    try{
        const user = await User.findById( req.user._id );
        if( !user || user.deactivation.isDeactive ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "User couldn't found"
                }
            );
        }

        if( !( user.careGiveGUID ) ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "You are not subseller"
                }
            );
        }

        const eventAdminParamGuid = user.careGiveGUID.toString()

        if(
            !req.body.desc
            || !req.body.adressDesc
            || !req.body.lat
            || !req.body.long
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing property"
                }
            );
        }

        if(
            ( req.body.ticketPrice && !req.body.ticketPriceType )
            || ( !req.body.ticketPrice && req.body.ticketPriceType )
        ){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing property for ticketprice"
                }
            );
        }

        const eventDate = Date.parse(req.body.date);

        await new Event(
            {
                eventAdmin: user._id.toString(),
                eventAdminsParamGuid: eventAdminParamGuid,
                eventOrganizers: [ req.user._id.toString() ],
                desc: req.body.desc,
                ticketPrice: {
                    priceType: req.body.ticketPriceType,
                    price: req.body.ticketPrice
                },
                adress: {
                    adressDesc: req.body.adressDesc,
                    lat: req.body.lat,
                    long: req.body.long
                },
                maxGuest: req.body.maxGuest,
                date: eventDate,
                expiryDate: new Date( eventDate + 7*24*60*60*1000 ),
                isPrivate: req.body.isPrivate
            }
        ).save().then(
            (event) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: `Story with id ${event._id}, planed succesfully at ${event.date}`,
                        eventId: event._id.toString(),
                        desc: event.desc,
                        ticketPrice: event.ticketPrice,
                        adress: event.adress,
                        maxGuest: req.body.maxGuest,
                        date: eventDate
                    }
                );
            }
        ).catch(
            (error) => {
                return res.status(500).json(
                    {
                        error: true,
                        data: error,
                        message: "An error occured while saving event data"
                    }
                );
            }
        );
    }catch(err){
        console.log("ERROR: create event - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default createEventController;