import AdminLoginCode from "../../models/Admin/AdminLoginCode.js";

import crypto from "node:crypto";
import QRCode from "qrcode";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const getAdminLoginQrCodeController = async ( req, res ) => {
    try{
        const clientId = req.params.socketId.toString();
        if( !clientId ){ 
            return res.status( 400 ).json({ error: true, message: "Missing Params" });
        }

        //delete old
        await AdminLoginCode.deleteMany({ clientId });

        //generate password
        const generatedQrCodePassword = crypto.randomBytes( 12 ).toString( 'hex' );
        const salt = await bcrypt.genSalt( Number( process.env.SALT ) );
        const hashCodePassword = await bcrypt.hash( generatedQrCodePassword, salt );

        //qr code data
        const data = { qrCodePassword: generatedQrCodePassword };
        let qrCodeData = JSON.stringify( data );

        // Get the base64 url
        QRCode.toDataURL(
            qrCodeData,
            {
                color: {
                  dark: '#000000ff',  // Black dots
                  light: '#0000' // Transparent background
                }
            },
            ( err, url ) => {
                if( err ){
                    return res.status( 500 ).json({ error: true, message: "error wile generating QR code" });
                }

                await new AdminLoginCode({
                        clientId: clientId,
                        codePassword: hashCodePassword
                }).save();

                return res.status( 200 ).json({
                    error: false,
                    message: "QR Code generated succesfully",
                    clientId: clientId,
                    code: url,
                });
            }
        );
        
    }catch( err ){
        console.log( "ERROR: getAdminLoginQrCodeController - ", err );
        return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
    }
}

export default getAdminLoginQrCodeController;