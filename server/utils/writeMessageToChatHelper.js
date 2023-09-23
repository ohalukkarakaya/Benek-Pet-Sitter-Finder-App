import EventInvitation from "../models/Event/Invitations/InviteEvent.js";
import CareGive from "../models/CareGive/CareGive.js";
import User from "../models/User.js";
import Pet from "../models/Pet.js";
import Event from "../models/Event/Event.js";

const writeMessageToChatHelper = async ( 
    chat,
    chatMembers,
    messageType,
    userId,
    fileUrlPath,
    message,
    paymentType,
    paymentReleatedRecordId,
    IdOfTheUserOrPetWhichProfileSended,
) => {
    try{
        let messageObject;

        //text mesajını ekle
        if( messageType === "Text" ){

            messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                message: message,
                seenBy: [ userId ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );
        }else if( messageType === "File" ){

            //file mesajını ekle
            messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                fileUrl: fileUrlPath,
                seenBy: [ userId ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );
        }else if( messageType === "PaymentOffer"){
            //ödeme teklifi mesajını ekle

            if( paymentType === "EventInvitation" ){
                // eğer etkinlik davetiyse, etkinlik davet objesini bul
                // yoksa hata dön
                const invitation = await EventInvitation.findById( paymentReleatedRecordId );
                if( !invitation ){
                    return {
                        error: true,
                        status: 404,
                        message: "Invitation not found"
                    }
                }

                // eğer etkinlik davetini gönderen kullanıcı etkinlik admini değilse
                // ya da etkinliğe davet eden kullanıcı sohbet objesi içerisinde yoksa
                // hata dön
                const eventAdmin = invitation.eventAdminId.toString();
                const invitedId = invitation.invitedId.toString();
                if( 
                    eventAdmin !== userId 
                    || !(chatMembers.includes( invitedId )) 
                ){
                    return {
                        error: true,
                        status: 401,
                        message: "UnAthorized"
                    }
                }

                messageObject = {
                    sendedUserId: userId,
                    messageType: messageType,
                    paymentOffer: {
                        receiverUserId: invitedId,
                        paymentType: paymentType,
                        releatedRecordId: paymentReleatedRecordId
                    },
                    seenBy: [ userId ],
                    sendDate: Date.now()
                }

                chat.messages.push( messageObject );

            }else if( paymentType === "CareGive" ){
                // eğer mesağ bakım hizmeti davetiyse, bakım hizmeti objesini bul
                // yoksa hata dön
                const careGive = await CareGive.findById( paymentReleatedRecordId );
                if( !careGive ){
                    return {
                        error: true,
                        status: 404,
                        message: "Invitation not found"
                    }
                }

                // eğer istek atan kullanıcı bakım hizmetinin bakıcısı değilse
                // ya da davet edilen kullanıcı sohbet içerisinde yoksa hata dön
                const invitation = careGive.invitation;
                if( 
                    !( invitation.from.toString() !== userId ) 
                    || !( chatMembers.includes( invitation.to.toString() ) )
                ){
                    return {
                        error: true,
                        status: 401,
                        message: "UnAthorized"
                    }
                }

                messageObject = {
                    sendedUserId: userId,
                    messageType: messageType,
                    paymentOffer: {
                        receiverUserId: invitedId,
                        paymentType: paymentType,
                        releatedRecordId: paymentReleatedRecordId
                    },
                    seenBy: [ userId ],
                    sendDate: Date.now()
                }

                chat.messages.push( messageObject );
            }

        }else if( messageType === "UserProfile" ){
            //kullanıcı profili mesajını ekle

            // profili gönderilen kullanıcıyı bul, eğer kullanıcı yoksa
            // ya da hesabını dondurduysa hata dön
            const sharedProfileUser = await User.findById( IdOfTheUserOrPetWhichProfileSended );
            if( 
                !sharedProfileUser 
                || sharedProfileUser.deactivation.isDeactive
            ){
                return {
                    error: true,
                    status: 404,
                    message: "User not found"
                }
            }

            messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                IdOfTheUserOrPetWhichProfileSended: sharedProfileUser._id.toString(),
                seenBy: [ userId ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );

        }else if( messageType === "PetProfile" ){
            // pet profili mesajını ekle

            // profili gönderilen hayvanı bul, yoksa hata dön
            const sharedProfilePet = await Pet.findById( IdOfTheUserOrPetWhichProfileSended );
            if( !sharedProfilePet ){
                return {
                    error: true,
                    status: 404,
                    message: "Pet not found"
                }
            }
            
            messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                IdOfTheUserOrPetWhichProfileSended: sharedProfilePet._id.toString(),
                seenBy: [ userId ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );

        }else if( messageType === "Event" ){
            // Etkinlik mesajını ekle

            // Gönderilen Etkinligi bul yoksa hata dön
            const sharedProfileEvent = await Event.findById( IdOfTheUserOrPetWhichProfileSended );
            if( !sharedProfileEvent ){
                return {
                    error: true,
                    status: 404,
                    message: "Event not found"
                }
            }

            // etkinliğin katılacaklar ve katılmış olanlar listesinde
            // olmayan sohbet kullanıcılarını tespit et
            const willJoin = sharedProfileEvent.willJoin;
            const joined = sharedProfileEvent.joined;
            const authorizedUsers = Array.from( new Set( willJoin.concat( joined ) ) );
            const unAuthorizedUsersInChat = chatMembers.filter( memberId => !authorizedUsers.includes( memberId ));

            // eğer etkinli gizli etkinlikse ve sohbette
            // katılma izni olmayan kişiler varsa hata dön
            if(
                sharedProfileEvent.isPrivate
                && unAuthorizedUsersInChat
            ){
                return {
                    error: true,
                    status: 401,
                    message: "UnAthorized"
                }
            }
            
            messageObject = {
                sendedUserId: userId,
                messageType: messageType,
                IdOfTheUserOrPetWhichProfileSended: sharedProfileEvent._id.toString(),
                seenBy: [ userId ],
                sendDate: Date.now()
            }

            chat.messages.push( messageObject );
        }

        if( messageObject ){
            chat.markModified( "messages" );
            const savedChat = await chat.save();
            if( !savedChat ) {
                console.error( `ERROR: While send message!` );
                return {
                    error: true,
                    status: 500,
                    message: "Internal Server Error"
                }
            }

            return messageObject; 
        }
    }catch( err ){
        console.log( "ERROR: writeMessageToChatHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default writeMessageToChatHelper;