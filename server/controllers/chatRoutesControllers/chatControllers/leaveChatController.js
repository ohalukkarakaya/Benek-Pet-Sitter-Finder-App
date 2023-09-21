import Chat from "../../../models/Chat/Chat.js";

import deleteFileHelper from "../../../utils/fileHelpers/deleteFileHelper.js";

const leaveChatController = async ( req, res ) => {
    try{
        const chatId = req.params.chatId.toString();
        if( !chatId ){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "missing params"
                            }
                       );
        }

        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "chat not found"
                            }
                       );
        }

        const chatMemberUsersIdsList = chat.members.map(
            member => 
                member.userId
        );

        const isUserMember = chat.members.filter(
                                member => 
                                    member.userId === req.user._id.toString() 
                                    && !( member.leaveDate )
                             ).length > 0

        if( !isUserMember ){
            return res.status( 401 )
                      .json(
                            {
                                error: true,
                                message: "You are not member"
                            }
                       );
        }

        const idListWithOutLeavingUser = chatMemberUsersIdsList.filter(
            userId =>
                    userId.toString() !== req.user._id.toString()
        );
        const aggregatePipeline = [
            {
              $match: {
                'members.userId': { $all: idListWithOutLeavingUser },
              },
            },
        ];
        const chatWithSameMembers = await Chat.aggregate( aggregatePipeline );
        const chatWithSameMembersFilterMemberCount = chatWithSameMembers.filter(
            chatObject =>
                chatObject.members
                          .filter(
                            member => !( member.leaveDate )
                          ).length === idListWithOutLeavingUser.length
        )

        const isUserAlone = idListWithOutLeavingUser.length < 2
        const areThereChatWithSameMembers = chatWithSameMembersFilterMemberCount[ 0 ]
                                            && chatWithSameMembersFilterMemberCount[ 0 ]._id.toString() !== chat._id.toString()
                                            && chatWithSameMembersFilterMemberCount.length > 0;

        const leavingMember = chat.members.filter( memberObject => memberObject.userId === req.user._id.toString() )[ 0 ];
        leavingMember.leaveDate = Date.now();

        if( isUserAlone ){
            //delete images of chat
            const deleteAssets = await deleteFileHelper( `chatAssets/${chat._id.toString()}` );
            if( deleteAssets.error ){
                return res.status( 500 )
                        .json(
                            {
                                error: true,
                                message: "Internal Server Error"
                            }
                        );
            }
        }

        let newChatId;
        if( areThereChatWithSameMembers ){
            // move chat history to new one
            const newChatToMove = await Chat.findById( chatWithSameMembersFilterMemberCount[ 0 ]._id.toString() );
            const memberDataToPass = {
                userId: leavingMember.userId,
                joinDate: leavingMember.joinDate,
                leaveDate: leavingMember.leaveDate
            }
            newChatToMove.members.push( memberDataToPass );
            for(
                let message
                of chat.messages
            ){
                const messageDataToPass = {
                    sendedUserId: message.sendedUserId,
                    messageType: message.messageType,
                    IdOfTheUserOrPetWhichProfileSended: message.IdOfTheUserOrPetWhichProfileSended,
                    fileUrl: message.fileUrl,
                    message: message.message,
                    paymentOffer: message.paymentOffer,
                    seenBy: message.seenBy,
                    sendDate: message.sendDate
                }

                newChatToMove.messages.push( messageDataToPass );
            }

            newChatToMove.markModified( "members" );
            newChatToMove.markModified( "messages" );

            newChatId = newChatToMove._id.toString();

            await newChatToMove.save();
        }

        if( isUserAlone || areThereChatWithSameMembers ){
            await chat.deleteOne();
        }

        chat.markModified( "members" );
        chat.save(
            function ( err ) {
              if( err ){
                  console.error( 'ERROR: While leave chat!' );
              }
            }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            newChat: newChatId,
                            message: "chat left succesfully"
                        }
                   );

    }catch( err ){
        console.log( err );
        res.status( 500 )
           .json(
                {
                    error: true,
                    message: "Internal Server Error"
                }
            );
    }
}

export default leaveChatController;