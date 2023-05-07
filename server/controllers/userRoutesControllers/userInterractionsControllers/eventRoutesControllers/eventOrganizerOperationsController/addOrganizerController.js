import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../../models/Event/Invitations/InviteOrganizer.js";

const addOrganizerController = async (req, res) => {
    try{
        const eventId = req.params.eventId;
        const organizerId = req.body.organizerId;
        if(!eventId || !organizerId){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing or wrong params"
                }
            );
        }

        const meetingEvent = await Event.findById(eventId);
        if(!meetingEvent){
            return res.status(404).json(
                {
                    error: true,
                    message: "Event not found"
                }
            );
        }

        if(meetingEvent.date <= Date.now()){
            return res.status(400).json(
                {
                    error: true,
                    message: "This event is expired"
                }
            );
        }

        const isAdmin = meetingEvent.eventAdmin === req.user._id.toString();
        if(!isAdmin){
            return res.status(403).json(
                {
                    error: true,
                    message: "You are not authorized to invite organizer to this event"
                }
            );
        }

        const organizer = await User.findById( organizerId );
        if(
            !organizer 
            || organizer.deactivation.isDeactive
            || organizer.blockedUsers.includes( req.user._id.toString() )
        ){
            return res.status(404).json(
                {
                    error: true,
                    message: "User not found"
                }
            );
        }
            
        await new OrganizerInvitation(
            {
                eventAdminId: req.user._id.toString(),
                eventId: meetingEvent._id.toString(),
                invitedId: organizer._id.toString(),
                eventDate: meetingEvent.date,
            }
        ).save().then(
            (invitation) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: `You invited user "${organizer._id.toString()}" successfully`
                    }
                );
            }
        ).catch(
            (error) => {
                console.log(error);
                return res.status(500).json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
            }
        );
        
    }catch(err){
        console.log("ERROR: invite event organizer - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default addOrganizerController;