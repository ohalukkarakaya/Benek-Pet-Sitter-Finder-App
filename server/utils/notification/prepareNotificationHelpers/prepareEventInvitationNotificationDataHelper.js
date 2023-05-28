import EventInvitation from "../../../models/Event/Invitations/InviteEvent.js";
import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareEventInvitationNotificationDataHelper = async ( notification ) => {
    try{
        const invitation = await EventInvitation.findById(
                                                    notification.releatedContent
                                                                .id
                                                                .toString()
                                                 );
                                                
        if( !invitation ){
            return {
                error: true,
                message: "invitation not found"
            }
        }

        const eventAdmin = await User.findById( 
                                            invitation.eventAdminId
                                                      .toString() 
                                      );

        if( !eventAdmin ){
            return {
                error: true,
                message: "event admin not found"
            }
        }

        const invitedEvent = await Event.findById(
                                            invitation.eventId
                                                      .toString()
                                         );

        if( !invitedEvent ){
            return {
                error: true,
                message: "invitedEvent not found"
            }
        }

        const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );

        const notificationData = {
            error: false,
            contentType: "eventInvitation",
            notificationId: notification._id.toString(),
            invitationId: invitation._id.toString(),
            invitationDate: invitation.eventDate,
            eventId: invitedEvent._id.toString(),
            eventAdmin: eventAdminInfo,
            eventDesc: invitedEvent.desc,
            eventImg: invitedEvent.imgUrl,
            isPrivate: invitation.isPrivate,
            price: invitation.ticketPrice,
            date: notification.date
        }

        return notificationData;
    }catch( err ){
        console.log( "ERROR: prepareEventInvitationNotificationDataHelper - ", err );
        return err;
    }
}

export default prepareEventInvitationNotificationDataHelper;