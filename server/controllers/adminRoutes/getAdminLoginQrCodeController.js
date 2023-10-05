import AdminLoginCode from "../../models/Admin/AdminLoginCode.js";

import crypto from "node:crypto";
import { QRCodeStyling } from "qr-code-styling-node/lib/qr-code-styling.common.js"
import nodeCanvas from "canvas";
import { JSDOM } from "jsdom";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const getAdminLoginQrCodeController = async ( req, res ) => {
    try{
        const clientId = req.params.clientId.toString();
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

        // qr code options
        const options = {
            width: 300,
            height: 300,
            data: qrCodeData,
            image: path.resolve( './src/benek_amblem.png' ),
            dotsOptions: { type: "dots" },
        };

        const qrCodeSvgWithBlobImage = new QRCodeStyling({ 
            jsdom: JSDOM, // this is required
            nodeCanvas, // this is required
            type: "svg",
            ...options,
            imageOptions: {
                saveAsBlob: true,
                crossOrigin: "anonymous",
                margin: 0
            },
            backgroundOptions: { color: 'rgba(255, 255, 255, 0)' },
            cornersSquareOptions: { type: 'dot' },
            cornersDotOptions: { type: 'extra-rounded' }
        });

        qrCodeSvgWithBlobImage.getRawData("svg").then(( url ) => {
            await new AdminLoginCode({
                clientId: clientId,
                codePassword: hashCodePassword
            }).save();

            return res.status( 200 ).json({
                error: false,
                clientId: clientId,
                code: url,
            });
        });

        return res.status( 500 ).json({ error: true, message: "Internal Server Error" })
        
    }catch( err ){
        console.log( "ERROR: getAdminLoginQrCodeController - ", err );
        return res.status( 500 ).json({ error: true, message: "Internal Server Error" });
    }
}

export default getAdminLoginQrCodeController;