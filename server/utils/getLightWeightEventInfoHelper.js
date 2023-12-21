import User from "../models/User.js";

import getLightWeightUserInfoHelper from "./getLightWeightUserInfoHelper.js";

async function processUserList( userIds ){
    const userPromises = userIds.map(
        async userId => {
            const user = await User.findById( userId );
            return getLightWeightUserInfoHelper( user );
        }
    );

    return await Promise.all( userPromises );
}

const processAfterEventObject = async afterEventObject => {
    // İlgili afterEventObject'un işlemleri burada gerçekleşecek

    // Öncelikle, afterEventObject içindeki 'likes' alanındaki kullanıcıları işleyelim
    const likedUsersPromises = afterEventObject.likes.map(
        async likedUserId => {
            const likedUser = await User.findById( likedUserId.toString() );
            return getLightWeightUserInfoHelper( likedUser );
        }
    );
    
    const likedUsers = await Promise.all( likedUsersPromises );
    // 'comments' alanını temizle
    delete afterEventObject.comments;
    // 'likedUsers' alanını güncelle
    afterEventObject.likedUsers = likedUsers;
    // Eğer tüm beğenenler eklenmişse, 'likes' alanını temizle
    if( likedUsers.length === afterEventObject.likes.length ){
        delete afterEventObject.likes;
    }
    // 'userId' alanını kullanarak içerik oluşturan kullanıcıyı işle
    const contentCreator = await User.findById( afterEventObject.userId.toString() );
    const contentCreatorInfo = getLightWeightUserInfoHelper( contentCreator );

    afterEventObject.user = contentCreatorInfo;
    delete afterEventObject.userId;

    return afterEventObject;
}

const getRelevantUserInfo = async userId => {
    const user = await User.findById( userId );
    return getLightWeightUserInfoHelper( user );
}

const getLightWeightEventInfoHelper = async ( event ) => {
    try{
        // veriyi hazırla
        const willJoinList = event && event.willJoin ? await processUserList( event.willJoin ) : [];
        const joinedList = event && event.joined ? await processUserList( event.joined ) : [];
        const organizersList = event && event.eventOrganizers ? await processUserList( event.eventOrganizers ) : [];
        const eventAdminInfo = event && event.eventAdmin ? await getRelevantUserInfo( event.eventAdmin.toString() ) : {};

        let lastAfterEventObject = null;
        if( event && event.afterEvent && event.afterEvent.length > 0 ){
            lastAfterEventObject = await processAfterEventObject( event.afterEvent[ event.afterEvent.length - 1 ] );
        }

        const remainedEventQuota = event
                                   && event.maxGuest
                                    ? event.maxGuest - [...willJoinList, ...joinedList].length
                                    : "No Quota";
                                    
        const ticketPrice = event
                            && event.ticketPrice
                                ? event.ticketPrice.priceType === "Free"
                                    ? event.ticketPrice.priceType
                                    : `${event.ticketPrice.price} ${event.ticketPrice.priceType}`
                                : "N/A";

        return {
            eventId: event ? event._id.toString() : null,
            eventImg: event && event.imgUrl ? event.imgUrl : null,
            isPrivate: event ? event.isPrivate : false,
            eventAdmin: eventAdminInfo,
            organizers: organizersList,
            ticketPrice: ticketPrice,
            maxGuestLimit: event && event.maxGuest ? event.maxGuest : "No Quota",
            remainedGuestQuota: remainedEventQuota,
            eventDate: event && event.date ? event.date : "Date Not Found",
            eventAdress: event && event.adress ? event.adress : "Adress Not Found",
            willJoin: willJoinList,
            joined: joinedList,
            lastAfterEvent: lastAfterEventObject
        };
    }catch( err ){
        console.log( "ERROR: event lightweight info - ", err );
        return err;
    }
}

export default getLightWeightEventInfoHelper;