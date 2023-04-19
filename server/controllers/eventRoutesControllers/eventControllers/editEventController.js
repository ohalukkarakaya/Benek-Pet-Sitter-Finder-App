import Event from "../../../models/Event/Event.js";
import dotenv from "dotenv";

dotenv.config();

const editEventController = async (req, res) => {
    try{
        const eventId = req.params.eventId;
        if(!eventId){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        const meetingEvent = await Event.findById(eventId);
        if(!meetingEvent){
            return res.status(404).json(
                {
                    error: true,
                    message: "event not found"
                }
            );
        } 

        if(meetingEvent.eventAdmin.toString() !== req.user._id.toString()){
            return res.status(401).json(
                {
                    error: true,
                    message: "you are not authorized to edit this event"
                }
            );
        }

        if(Date.parse(meetingEvent.date) <= Date.now()){
            return res.status(400).json(
                {
                    error: true,
                    message: "too late to edit this event"
                }
            );
        }

        const newEventDesc = req.body.newEventDesc;
        if(newEventDesc){
            meetingEvent.desc = newEventDesc;
            meetingEvent.markModified("desc");
        }
        const newEventDate = req.body.newEventDesc;
        if(newEventDate){
            if(Date.parse(newEventDate) <= Date.now()){
                return res.status(400).json(
                    {
                        error: true,
                        message: "New event date is not valid"
                    }
                );
            }

            meetingEvent.date = Date.parse(newEventDate);
            meetingEvent.expiryDate = new Date( newEventDate + 7*24*60*60*1000 );
            meetingEvent.markModified("date");
            meetingEvent.markModified("expiryDate");
        }

        const newAdress = req.body.newAdress;
        if(newAdress){
            if(
                !newAdress.adressDesc
                || !newAdress.lat
                || !newAdress.long
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing adress info"
                    }
                );
            }

            meetingEvent.adress = newAdress;
            meetingEvent.markModified("adress");
        }

        const newPrice = req.body.newPrice;
        if(newPrice){
            if(
                newPrice && !newPrice.priceType
                || newPrice && ! newPrice.price
            ){
                return res.status(400).json(
                    {
                        error: true,
                        message: "missing price param"
                    }
                );
            }
            meetingEvent.ticketPrice = newPrice;
            meetingEvent.markModified("ticketPrice");
        }

        if(
            newEventDesc
            || newEventDate
            || newAdress
            || newPrice
        ){
            meetingEvent.save(
                (error) => {
                    if(error){
                        console.log(error);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                }
            );

            return res.status(200).json(
                {
                    error: false,
                    message: "event updated succesfully"
                }
            );
        }else{
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing params"
                }
            );
        }
    }catch(err){
        console.log("ERROR: edit event - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default editEventController;