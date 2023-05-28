import Event from "../../../models/Event/Event.js";
import User from "../../../models/User.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";

const prepareInviteOrganizerDataHelper = async ( invitation ) => {
    try{
        const invitedEvent = await Event.findById( invitation.eventId.toString() );
        if( !invitedEvent ){
            return {
                error: true,
                message: "Event Not Found"
            }
        }

        const eventDate = new Date( invitedEvent.date );
        const now = new Date(); 
        const didPast = eventDate < now;

        const eventQuota = didPast 
                            || invitedEvent.maxGuests === -1
                                ? -1
                                : invitedEvent.maxGuests - invitedEvent.willJoin
                                                                       .length

        const eventInfo = {
            eventId: invitedEvent._id.toString(),
            eventDesc: invitedEvent.desc,
            eventImage: invitedEvent.imgUrl,
            adress: invitedEvent.adress,
            date: invitedEvent.date,
            maxGuests: invitedEvent.maxGuests,
            willJoinCount: invitedEvent.willJoin.length,
            joinedCount: invitedEvent.joined.length,
            didpast: didPast,
            quota: eventQuota,
            isPrivate: invitedEvent.isPrivate
        };

        const eventAdmin = await User.findById( 
                                            invitedEvent.eventAdmin
                                                        .toString() 
                                      );

        if( !eventAdmin ){
            return {
                error: true,
                message: "User Not Found"
            }
        }
        const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );

        invitation.event = eventInfo;
        invitation.admin = eventAdminInfo;
        delete invitation.eventId;
        delete invitation.eventAdminId;

        invitation.type = "InviteOrganizer";

        return {
            error: false,
            data: invitation
        }

    }catch( err ){
        console.log( "ERROR: prepareInviteOrganizerDataHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default prepareInviteOrganizerDataHelper;