import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import OrganizerInvitation from "../../../../models/Event/Invitations/InviteOrganizer.js";
import auth from "../../../../middleware/auth.js";

const router = express.Router();

//add organizer
router.post(
    "/:eventId",
    auth,
    async (req, res) => {
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

            const organizer = await User.findById(organizerId);
            if(!organizer){
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
);

//accept organizer invitation
router.delete(
    "/:invateId/:response",
    auth,
    async (req, res) => {
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
);

//stop being organizer
router.put(
    "/remove/:eventId",
    auth,
    async (req, res) => {
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
);

export default router;