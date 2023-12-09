import AdminLoginCode from "../../models/Admin/AdminLoginCode.js";
import UserToken from "../../models/UserToken.js";
import User from "../../models/User.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import io from "socket.io-client";

import generateTokens from "../../utils/bodyValidation/user/generateTokens.js";

dotenv.config();
const socket = io( process.env.SOCKET_URL );

//  *        ø        *         .                      *            .   *           .    *
//                                *                  *  .                .
//  *                *        .       *                ☾         *.             *.     .  *.   .
//      *           .       *                *                 .               *.        *   .
//     . adminLoginController   *       .         * .                  .  ø 

const adminLoginController = async ( req, res ) => {
    try{
        //parametreleri karşıla eksikse hata dön
        const { codePassword, clientId } = req.body;
        if( !codePassword || !clientId ){
            return res.status( 400 ).json({ error: true, message: "Missing Params" });
        }

        // login kodu objesini bul, bulunamazsa hata dön
        const adminLoginCode = await AdminLoginCode.findOne({ clientId });
        if( !adminLoginCode ){ return res.status( 404 ).json({ error: true, message: "There is no code for your user" }); }

        // bulunan kod bir saat önce ya da daha eski tarihte oluşturulduysa, kodu sil ve hata dön
        const expiryTime = new Date();
        expiryTime.setHours( expiryTime.getHours() - 1 );
        if( adminLoginCode.createdAt <= expiryTime ){
            await adminLoginCode.deleteOne();
            return res.status( 401 ).json({ error: true, message: "Code Expired" });
        }

        // gönderilen şifreyi kıyasla hatalıysa hata dön
        const verifiedPassword = await bcrypt.compare( codePassword, adminLoginCode.codePassword );
        if( !verifiedPassword ){
            return res.status( 401 ).json({ error: true, message: "Wrong Password" });
        }

        // kullanıcıyı bul
        const user = await User.findById( req.user._id.toString() );

        // kullanıcının kayıtlı refresh tokenını bul, yoksa generate et
        let refreshToken;
        let userToken = await UserToken.findOne({ userId: req.user._id.toString() });
        const tokenDetails = await verifyRefreshToken( userToken );

        //tokenın geçerliliğini kontrol et eğer değilse token oluştur
        if( !userToken || tokenDetails.error ){ 
            const tokenGeneration = await generateTokens( user );
            refreshToken = tokenGeneration.refreshToken;
        }else{
            refreshToken = userToken;
        }

        // göndermek için veriyi hazırla
        let userInfoObject = { userId: req.user._id.toString(), authRole: user.authRole, refreshToken: refreshToken };

        // web sockete user bilgisini gönder
        socket.emit( "adminLogin", adminLoginCode.clientId.toString(), userInfoObject );

        // login kodunu sil
        await adminLoginCode.deleteOne();

        // mobile başarılı cevabı dön
        return res.status( 200 ).json({
            error: false,
            message: "Loged In Succesfully, you will be loged in from desktop app"
        });

    }catch( err ){

    }
}

export default adminLoginController;