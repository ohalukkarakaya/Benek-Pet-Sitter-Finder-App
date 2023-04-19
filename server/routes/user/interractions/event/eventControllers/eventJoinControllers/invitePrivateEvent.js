import User from "../../../../../../models/User.js";
import Event from "../../../../../../models/Event/Event.js";
import EventInvitation from "../../../../../../models/Event/Invitations/InviteEvent.js";

import dotenv from "dotenv";

dotenv.config();

const invitePrivateEvent = async ( req, res ) => {
    try{
        if(!req.params.eventId){
            return res.status(400).json(
                {
                    error: true,
                    message: "evetId is required"
                }
            );
        }

        const event = await Event.findById( req.params.eventId );
        if(!event){
            return res.status(404).json(
                {
                    error: true,
                    message: "Event not found"
                }
            );
        }

        const invitedUser = await User.findById(req.params.invitedUserId);
        if(!invitedUser || invitedUser.deactivation.isDeactive){
            return res.status(404).json(
                {
                    error: true,
                    message: "User not found"
                }
            );
        }

        const isAdmin = req.user._id.toString() === event.eventAdmin;
        const isOrganizer = event.eventOrganizers
                                 .find( 
                                    userId => 
                                        userId.toString() === req.user
                                                                 ._id
                                                                 .toString() 
                                );

        const isPrivate = event.isPrivate;

        if(
            isPrivate && !isAdmin
            || !isPrivate && !isAdmin && !isOrganizer
        ){
            return res.status(401).json(
                {
                    error: true,
                    message: "You are not authorized to invite any user to this event"
                }
            );
        }

        if(event.date <= Date.now()){
            return res.status(400).json(
                {
                    error: true,
                    message: "Event is expired"
                }
            );
        }

        if(event.maxGuests !== -1 && event.maxGuests <= event.willJoin.length){
            return res.status(400).json(
                {
                    error: true,
                    message: "Guest quota exceeded"
                }
            );
        }
        
        const isUserAlreadyJoining = event.willJoin.find( userId => userId === req.user._id.toString() );
        if(isUserAlreadyJoining){
            return res.status(400).json(
                {
                    error: true,
                    message: "invited user is already participant of event"
                }
            );
        }

        const areThereAnyPastInvitation = await EventInvitation.findOne(
            {
                eventId: event._id.toString(),
                invitedId: req.user._id.toString()
            }
        );
        if(areThereAnyPastInvitation){
            return res.status(400).json(
                {
                    error: true,
                    message: "User already Invited"
                }
            );
        }

        await new EventInvitation(
            {
                eventAdminId: event.eventAdmin,
                eventId: event._id.toString(),
                invitedId: invitedUser._id.toString(),
                ticketPrice: event.ticketPrice,
                eventDate: event.date,
                isPrivate: event.isPrivate
            }
        ).save().then(
            (invitation) => {
                return res.status(200).json(
                    {
                        error: false,
                        message: `User ${invitation.invitedId} invited succesfully`
                    }
                );
            }
        ).catch(
            (error) => {
                console.log(error);
                return res.status(500).json(
                    {
                        error: true,
                        messaage: "Internal server error"
                    }
                );
            }
        );

        
    }catch(err){
        console.log("ERROR: invite to event - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
};

export default invitePrivateEvent;