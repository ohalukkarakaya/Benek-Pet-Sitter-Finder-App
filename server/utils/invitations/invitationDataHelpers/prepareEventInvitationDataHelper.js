import User from "../../../models/User.js";
import Event from "../../../models/Event/Event.js";

import getLightWeightUserInfoHelper from "../../getLightWeightUserInfoHelper.js";


const prepareEventInvitationDataHelper = async ( invitation ) => {
    try{
        const eventAdmin = await User.findById( 
                                            invitation.eventAdminId
                                                      .toString() 
                                      );

        if( !eventAdmin ){
            return {
                error: true,
                message: "User Not Found"
            }
        }
                        
        const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );
                
        invitation.admin = eventAdminInfo;
        delete invitation.eventAdminId;
                
        const invitedEvent = await Event.findById( invitation.eventId );
        if( !invitedEvent ){
            return {
                error: true,
                message: "Event Not Found"
            }
        }
                
        const ticketPrice = invitedEvent.ticketPrice.priceType !== "Free" 
                                ? `${ invitedEvent.ticketPrice.price } ${ invitedEvent.ticketPrice.priceType }`
                                : `${ invitedEvent.ticketPrice.priceType }`
                
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
            ticketPrice: ticketPrice,
            adress: invitedEvent.adress,
            date: invitedEvent.date,
            maxGuests: invitedEvent.maxGuests,
            willJoinCount: invitedEvent.willJoin.length,
            joinedCount: invitedEvent.joined.length,
            didpast: didPast,
            quota: eventQuota,
        };
                
        invitation.event = eventInfo;
        delete invitation.eventId;
        delete invitation.invitedId;

        invitation.type = "EventInvitation";
                
        return {
            error: false,
            data: invitation
        }
    }catch( err ){
        console.log( "ERROR: prepareEventInvitationDataHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default prepareEventInvitationDataHelper;