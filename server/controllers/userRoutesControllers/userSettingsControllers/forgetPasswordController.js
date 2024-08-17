import User from "../../../models/User.js";
import TempPassword from "../../../models/TempPassword.js";

import sendOneTimePassword from "../../../utils/sendOneTimePasswordEmail.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import UserToken from "../../../models/UserToken.js";

dotenv.config();

const forgetPasswordController = async ( req, res, next ) => {
    try{
        const email = req.body.email;
        if( !email ){
            return res.status( 400 ).json({
                   error: true,
                   message: "Email required"
            });
        }

        const user = await User.findOne({ email: req.body.email});
        if(!user || user.deactivation.isDeactive){
            return res.status( 404 ).json({
                error: true,
                message: "User couldn't found"
            });
        }

        const oneTimePassword = crypto.randomBytes( 6 ).toString( 'hex' );
        
        const salt = await bcrypt.genSalt(Number( process.env.SALT ));
        const hashedOneTimePassword = await bcrypt.hash( oneTimePassword, salt );

        sendOneTimePassword({ newPassword: oneTimePassword, email }, null, next );

        await UserToken.deleteMany({ userId: user._id.toString() });
        await new TempPassword(
            {
                userId: user._id.toString(),
                email: user.email,
                tempPassword: hashedOneTimePassword
            }
        ).save()
         .then(
            ( tempPassword ) => {

                return res.status( 200 ).json({
                      error: false,
                      message: "New password send to your email"
                });
            }
         ).catch(
            ( error ) => {
                if( error ){
                    return res.status( 500 ).json({
                        error: true,
                        message: "Internal Server Error"
                    });
                }
            }
         );
    }catch( err ){
        console.log( "ERROR: forgetPasswordController - ", err );
        return res.status( 500 ).json({
            error: true,
            message: "Internal server error"
        });
    }
}

export default forgetPasswordController;