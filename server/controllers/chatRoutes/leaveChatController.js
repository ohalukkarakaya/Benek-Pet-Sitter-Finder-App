import Chat from "../../models/Chat.js";

const leaveChatController = async (req, res) => {
    try{
        const chatId = req.params.chatId.toString();
        if( !chatId ){
            return res.status(400).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        const chat = await Chat.findById( chatId );
        if( !chat ){
            return res.status(404).json(
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

        const isUserMember = chatMemberUsersIdsList.includes( req.user._id.toString() );
        if( !isUserMember ){
            return res.status(401).json(
                {
                    error: true,
                    message: "You are not authorized"
                }
            );
        }

        const idListWithOutLeavingUser = chatMemberUsersIdsList.filter(
            userId =>
                    userId.toString() === req.user._id.toString()
        );

        if( idListWithOutLeavingUser.length < 2 ){
            //delete images of user
            async function emptyS3Directory(bucket, dir){
                const listParams = {
                    Bucket: bucket,
                    Prefix: dir
                };
                const listedObjects = await s3.listObjectsV2(listParams);
                if (listedObjects.Contents.length === 0) return;
                const deleteParams = {
                    Bucket: bucket,
                    Delete: { Objects: [] }
                };

                listedObjects.Contents.forEach(({ Key }) => {
                    deleteParams.Delete.Objects.push({ Key });
                });
                await s3.deleteObjects(deleteParams);
                if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
            }
            emptyS3Directory(process.env.BUCKET_NAME, `chatAssets/${chat._id.toString()}/`).then(
                async (_) => {
                    //delete chat
                    chat.deleteOne().then(
                        (_) => {
                            return res.status(200).json(
                                {
                                    error: false,
                                    message: "chat deleted succesfully"
                                }
                            );
                        }
                    ).catch(
                        (error) => {
                            if(error){
                                console.log(error);
                                return res.status(500).json(
                                    {
                                        error: true,
                                        message: "Internal server error"
                                    }
                                );
                            }
                        }
                    );
                }
            );
        }

        chat.members = chat.members.filter(
            member =>
                member.userId.toString() === req.user._id.toString()
        );
        chat.markModified("members");
        chat.save(
            function (err) {
              if(err) {
                  console.error('ERROR: While leave chat!');
              }
            }
          );

          return res.status(200).json(
            {
                error: false,
                message: "chat left succesfully"
            }
          );

    }catch(err){
        console.log(err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
}

export default leaveChatController;