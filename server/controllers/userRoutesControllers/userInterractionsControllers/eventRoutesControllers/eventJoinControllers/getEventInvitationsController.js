import User from "../../../../../models/User.js";
import Event from "../../../../../models/Event/Event.js";
import EventInvitation from "../../../../../models/Event/Invitations/InviteEvent.js";
import getLightWeightUserInfoHelper from "../../../../../utils/getLightWeightUserInfoHelper.js";

const getEventInvitationsController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const skip = parseInt( req.params.skip ) || 0;
        const limit = parseInt( req.params.limit ) || 15;

        const invitationQuery = { invitedId: userId };
        const invitations = await EventInvitation.find(
            invitationQuery
        ).skip( skip )
         .limit( limit );

        const totalInvitationCount = await EventInvitation.countDocuments( invitationQuery );

        if( invitations.length <= 0 ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "No Invitation Found"
                }
            );
        }

        let newInvitationList = [];
        for(
            let invitation
            of invitations
        ){
                const eventAdmin = await User.findById( 
                                                    invitation.eventAdminId
                                                              .toString() 
                                         );
                
                if( eventAdmin ){
                    const eventAdminInfo = getLightWeightUserInfoHelper( eventAdmin );
    
                    invitation.admin = eventAdminInfo;
                    delete invitation.eventAdminId;
    
                    const invitedEvent = await Event.findById( invitation.eventId );
    
                    const ticketPrice = invitedEvent.ticketPrice.priceType !== "Free" 
                                        ? `${ invitedEvent.ticketPrice.price } ${ invitedEvent.ticketPrice.priceType }`
                                        : `${ invitedEvent.ticketPrice.priceType }`
    
                    var eventDate = new Date( invitedEvent.date );
                    var now = new Date(); 
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
    
                    newInvitationList.push( invitation );
                }
        }

        return res.status( 200 )
                  .json(
                        {
                            error: true,
                            message: "Releated Invitation List Prepared Succesfully",
                            totalInvitationCount: totalInvitationCount,
                            invitations: newInvitationList
                        }
                  );
        
    }catch( err ){
        console.log( "ERROR: getEventInvitationsController - ", err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default getEventInvitationsController;