import Chat from "../../models/Chat/Chat.js";

import deleteFileHelper from "./deleteFileHelper.js";
import uploadFileHelper from "./uploadFileHelper.js";

import fs from "fs";
import multer from "multer";
import crypto from "crypto";

// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage });

const serverHandleChatImageHelper = async ( req, res ) => {
    try{
        // muşter ile gelen veriyi karşıla
        upload.single( 'file' )(
            req,
            {},
            async ( err ) => {
                if( err ){
                    console.log( "ERROR: serverHandleChatImageHelper - ", err );
                    return res.status( 500 )
                              .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                              );
                }

                // dosya jpg ya da jpeg değilse hata dön
                const fileType = req.file.mimetype;
                if(
                    fileType !== 'image/jpeg' 
                    && fileType !== 'image/jpg'
                ){
                    return res.status( 400 )
                              .json(
                                {
                                    error: true,
                                    message: "Wrong File Format"
                                }
                              );
                }

                // medya sunucusunda profil fotoğrafı gibi kırp ve sıkıştır
                const fileTypeEnum = "profile";

                // sohbet objesini bul
                const chatId = req.params.chatId.toString();
                const chat = await Chat.findById( chatId );

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

                // varsa var olan sohbet fotoğrafını sil
                if( chat.chatImageUrl ){
                    const deleteExistingImage = await deleteFileHelper( chat.chatImageUrl );
                    if( deleteExistingImage.error ){
                        return res.status( 500 )
                                .json(
                                    {
                                        error: true,
                                        message: "Internal Server Error"
                                    }
                                );
                    }
                }

                // orjinal dosya ismini al
                const { originalname } = req.file;

                // dosya isminden dosyanın uzantısını ayır
                const splitedOriginalName = originalname.split( "." );

                //dosyaya özgü rastgele bir isim üret
                const randId = crypto.randomBytes( 6 )
                                     .toString( 'hex' );

                // yeni dosya adını oluştur
                const newFileName =  chatId + "_"
                                             + randId 
                                             + "_ChatImage";

                // medya sunucusunda dosyanın yazılacağı yolu oluştur
                const pathToSend =  "chatAssets/" + chatId
                                                  + "/"
                                                  + newFileName;

                // orjinal dosya uzantısını oluştur
                const chatImagePath = pathToSend + "."
                                                 + splitedOriginalName[ splitedOriginalName.length - 1 ];

                // dosyayı axios ile medya sunucusuna gönderebilmek için
                // geçici olarak buraya yaz
                try { 
                    await fs.promises.writeFile(
                        newFileName + "."
                                    + splitedOriginalName[ splitedOriginalName.length - 1 ],
                        req.file.buffer,
                        "binary"
                    );
                }catch( err ){
                    console.error( "Dosya yazma hatası:", err );
                }

                //dosyanın içeriği okumasını sağla
                const writenFile = fs.createReadStream( 
                                                    newFileName + "."
                                                                + splitedOriginalName[ splitedOriginalName.length - 1 ] 
                                        );

                // dosyayı medya sunucusuna gönder
                const uploadChatImage = await uploadFileHelper(
                                                    writenFile,
                                                    newFileName + "."
                                                                + splitedOriginalName[ splitedOriginalName.length - 1 ],
                                                    fileTypeEnum,
                                                    pathToSend,
                                                    res
                                              );

                // geçici olarak yazılan dosyayı sil
                fs.rmSync( 
                    newFileName + "."
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

                // dosyanın yolunu sohbet objesine kaydet
                chat.chatImageUrl = chatImagePath;
                chat.markModified( "chatImageUrl" );
                chat.save();

                return res.status( 200 )
                          .json(
                            {
                                error: false,
                                message: "Chat Image Uploaded Succesfully",
                                imageUrl: chatImagePath
                            }
                          );
            }
        );
    }catch( err ){
        console.log( "ERROR: serverHandleChatImageHelper - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                  );
    }
}

export default serverHandleChatImageHelper;