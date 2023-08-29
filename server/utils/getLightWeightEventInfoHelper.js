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
    const likedUsersPromises = afterEventObject.likes
                                               .map(
                                                    async likedUserId => {
                                                        const likedUser = await User.findById(
                                                                                        likedUserId.toString()
                                                                                     );

                                                        return getLightWeightUserInfoHelper( likedUser );
                                                    }
                                                );
    
    const likedUsers = await Promise.all( likedUsersPromises );

    // 'comments' alanını temizleyelim
    delete afterEventObject.comments;

    // 'likedUsers' alanını güncelleyelim
    afterEventObject.likedUsers = likedUsers;

    // Eğer tüm beğenenler eklenmişse, 'likes' alanını temizleyelim
    if(
        likedUsers.length === afterEventObject.likes
                                              .length
    ){
        delete afterEventObject.likes;
    }

    // 'userId' alanını kullanarak içerik oluşturan kullanıcıyı işleyelim
    const contentCreator = await User.findById(
                                        afterEventObject.userId
                                                        .toString()
                                      );

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
        const willJoinList = await processUserList( event.willJoin );
        const joinedList = await processUserList( event.joined );
        const organizersList = await processUserList( event.eventOrganizers );

        const eventAdminInfo = await getRelevantUserInfo(
                                                event.eventAdmin
                                                     .toString()
                                     );

        let lastAfterEventObject = null;
        if (
            event.afterEvent
                 .length > 0
        ) {
            lastAfterEventObject = await processAfterEventObject(
                                                    event.afterEvent[
                                                                event.afterEvent
                                                                     .length - 1
                                                          ]
                                         );
        }

        const remainedEventQuota = event.maxGuest
                                    ? event.maxGuest - [...willJoinList, ...joinedList].length
                                    : "No Quota";
                                    
        const ticketPrice = event.ticketPrice.priceType === "Free"
                                ? event.ticketPrice.priceType
                                : `${event.ticketPrice.price} ${event.ticketPrice.priceType}`;

        return {
            eventId: event._id.toString(),
            eventImg: event.imgUrl,
            isPrivate: event.isPrivate,
            eventAdmin: eventAdminInfo,
            organizers: organizersList,
            ticketPrice: ticketPrice,
            maxGuestLimit: event.maxGuest,
            remainedGuestQuota: remainedEventQuota,
            eventDate: event.date,
            eventAdress: event.adress,
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