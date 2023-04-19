import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";
import OrganizerInvitation from "../../../models/Event/Invitations/InviteOrganizer.js";

const cancelOrganizerStatusController = async (req, res) => {
    try{
        const eventId = req.params.eventId;
        if(!eventId){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing or wrong param"
                }
            );
        }

        const meetingEvent = await Event.findById(eventId);
        if(!meetingEvent){
            return res.status(404).json(
                {
                    error: true,
                    message: "meeting not found"
                }
            );
        }

        const organizerId = req.body.organizerId;
        const isAdmin = meetingEvent.eventAdmin === req.user._id.toString();
        const isOrganizer = !isAdmin && meetingEvent.eventOrganizers.find(userId => userId === req.user._id.toString());
        if(!isAdmin && !isOrganizer){
            return res.status(403).json(
                {
                    error: true,
                    message: "You are not authorized to remove this organizer"
                }
            );
        }

        if(isAdmin && !organizerId){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing or wrong param"
                }
            );
        }

        let organizer;
        if(isAdmin){
            organizer = await User.findById(organizerId);
        }else{
            organizer = await User.findById(req.user._id.toString());
        }

        await OrganizerInvitation.deleteMany(
            {
                eventAdminId: meetingEvent.eventAdmin,
                eventId: meetingEvent._id.toString(),
                invitedId: organizer._id.toString(),
            }
        );

        meetingEvent.eventOrganizers = meetingEvent.eventOrganizers.filter(
            userId =>
                userId !== organizer._id.toString()
        );
        meetingEvent.markModified("eventOrganizers");
        meetingEvent.save().then(
            (_) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: "organizer removed succesfully"
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
        console.log("ERROR: remove organizer - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default cancelOrganizerStatusController;