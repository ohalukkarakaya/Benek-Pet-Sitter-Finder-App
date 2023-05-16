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

        const eventAdmin = await User.findById( 
                                            invitation.eventAdminId
                                                      .toString() 
                                      );

        const invitedEvent = await Event.findById(
                                            invitation.eventId
                                                      .toString()
                                         );

        

        const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );

        const notificationData = {
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