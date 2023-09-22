import Chat from "../../models/Chat/Chat.js";

import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const serverHandleChatFileHelper = async ( req, res, next ) => {
    try{
        // multer ile gelen veriyi karşıla
        upload.single( 'file' )(
            req,
            {},
            async ( err ) => {
                if( err ){
                    console.log( "ERROR: serverHandleChatFileHelper - ", err );
                    return res.status( 500 )
                              .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                              );
                }

                //mesaj dosya mesajı ise
                if( req.params.messageType === "File" ){
                    // dosya jpg ya da jpeg değilse hata dön
                    const fileType = req.file.mimetype;
                    if(
                        fileType !== 'image/jpeg' 
                        && fileType !== 'image/jpg'
                        && file.mimetype !== 'video/mp4'
                    ){
                        return res.status( 400 )
                                .json(
                                    {
                                        error: true,
                                        message: "Wrong File Format"
                                    }
                                );
                    }

                    //dosya video mu?
                    const isFileVideo = req.file.mimetype === 'video/mp4';

                    // medya sunucusunda profil fotoğrafı gibi kırp ve sıkıştır
                    const fileTypeEnum = isFileVideo
                                            ? "video"
                                            : "photo";

                    // sohbet objesini bul
                    const chatId = req.params.chatId.toString();
                    const chat = await Chat.findById( chatId ).clone();

                    // kullanıcının sohbete üye olup olmadığını kontrol et eğer
                    // üye değilse obje yüklemesine izin verme
                    const isUserMemberOfChat = chat.members
                                                .filter(
                                                        member =>
                                                            member.userId === req.user._id.toString()
                                                            && !( member.leaveDate )
                                                );
                    if( isUserMemberOfChat.length <= 0 ){
                        return res.status( 401 )
                                .json(
                                    {
                                        error: true,
                                        message: "Un Authorized"
                                    }
                                );
                    }

                    // orjinal dosya ismini al
                    const { originalname } = req.file;

                    // dosya isminden dosyanın uzantısını ayır
                    const splitedOriginalName = originalname.split( "." );

                    //dosyaya özgü rastgele bir isim üret
                    const randId = crypto.randomBytes( 6 )
                                        .toString( 'hex' );

                    // yeni dosya adını oluştur
                    req.newFileName =  chatId + "_"
                                              + randId 
                                              + "_ChatFile";

                    // medya sunucusunda dosyanın yazılacağı yolu oluştur
                    const pathToSend =  "chatAssets/" + chatId
                                                      + "/chatFile/"
                                                      + req.newFileName;

                    // orjinal dosya uzantısını oluştur
                    req.chatFilePath = pathToSend + "."
                                                  + splitedOriginalName[ splitedOriginalName.length - 1 ];

                    // dosyayı axios ile medya sunucusuna gönderebilmek için
                    // geçici olarak buraya yaz
                    try { 
                        await fs.promises.writeFile(
                            req.newFileName + "."
                                            + splitedOriginalName[ splitedOriginalName.length - 1 ],
                            req.file.buffer,
                            "binary"
                        );
                    }catch( err ){
                        console.error( "Dosya yazma hatası:", err );
                    }

                    //dosyanın içeriği okumasını sağla
                    const writenFile = fs.createReadStream( 
                                                        req.newFileName + "."
                                                                        + splitedOriginalName[ splitedOriginalName.length - 1 ] 
                                            );

                    // dosyayı medya sunucusuna gönder
                    const uploadChatImage = await uploadFileHelper(
                                                        writenFile,
                                                        req.newFileName + "."
                                                                        + splitedOriginalName[ splitedOriginalName.length - 1 ],
                                                        fileTypeEnum,
                                                        pathToSend,
                                                        res
                                                );

                    // geçici olarak yazılan dosyayı sil
                    fs.rmSync( 
                        req.newFileName + "."
                                        + splitedOriginalName[ splitedOriginalName.length - 1 ] 
                    );
                    if( uploadChatImage.error ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                    }
                }

                next();
            }
        );
    }catch( err ){
        console.log( "ERROR: serverHandleChatFileHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default serverHandleChatFileHelper;