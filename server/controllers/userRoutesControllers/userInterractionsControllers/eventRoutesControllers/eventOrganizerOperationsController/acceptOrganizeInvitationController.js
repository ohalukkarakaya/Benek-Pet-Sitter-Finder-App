import Event from "../../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../../models/Event/Invitations/InviteOrganizer.js";

const acceptOrganizeInvitationController = async (req,res) => {
    try{
        const invateId = req.params.invateId;
        if(!invateId || req.params.response){
            return res.status(400).json(
                {
                    error: true,
                    message: "Missing or wrong params"
                }
            );
        }

        const response = req.params.response === "true";

        const invitation = await OrganizerInvitation.findById(invateId);
        if(!invitation){
            return res.status(404).json(
                {
                    error: true,
                    message: "invitation not found"
                }
            );
        }

        const meetingEvent = await Event.findById(invitation.eventId);
        if(!meetingEvent){
            return res.status(404).json(
                {
                    error: true,
                    message: "meetingEvent not found"
                }
            );
        }

        if(meetingEvent.date <= Date.now()){
            invitation.deleteOne().then(
                (_) => {
                    return res.status(400).json(
                        {
                            error: true,
                            message: "This event is expired"
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
        }

        const isOrganizer = invitation.invitedId === req.user._id.toString();
        if(!isOrganizer){
            return res.status(403).json(
                {
                    error: true,
                    message: "You are not authorized to accept this invitation"
                }
            );
        }
        
        const isAlreadyOrganizer = meetingEvent.eventOrganizers.find(userId => userId === req.user._id.toString());
        if(isAlreadyOrganizer){
            return res.status(400).json(
                {
                    error: true,
                    message: "you are already organizer"
                }
            );
        }

        if(response){
            meetingEvent.eventOrganizers = meetingEvent.eventOrganizers.push(req.user._id.toString());
            meetingEvent.markModified("eventOrganizers");
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

            invitation.deleteOne().then(
                (_) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: "invitation accepted succesfully"
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
        }else{
            invitation.deleteOne().then(
                (_) => {
                    return res.status(200).json(
                        {
                            error: false,
                            message: "invitation rejected succesfully"
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
        console.log("ERROR: accept organizer invitation - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default acceptOrganizeInvitationController;