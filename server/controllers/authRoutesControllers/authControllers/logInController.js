import User from "../../../models/User.js";
import UserOTPVerification from "../../../models/UserOtpVerification.js";
import UserToken from "../../../models/UserToken.js";
import TempPassword from "../../../models/TempPassword.js";

import sendOTPVerificationEmail from "../../../utils/sendValidationEmail.js";
import generateTokens from "../../../utils/bodyValidation/user/generateTokens.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const logInController = async ( req, res, next ) => {
    try{
      const user = await User.findOne({ email: req.body.email });
      if( !user ){
        return res.status( 401 ).json({ error: true, message: "Invalid email or password" });
      }

      const userToken = await UserToken.findOne({ userId: user._id });
      if( userToken ){
        await userToken.remove();
      }

      const verifiedPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if( !verifiedPassword ){
        const tempPasswordObject = await TempPassword.findOne({ userId: user._id.toString() });
        let verifiedTempPass;
        if( tempPasswordObject ){
            verifiedTempPass = await bcrypt.compare( req.body.password, tempPasswordObject.tempPassword );
        }


        if( !tempPasswordObject || !verifiedTempPass ){
          return res.status( 401 ).json({ error: true,  message: "Invalid email or password" });
        }

        user.password = tempPasswordObject.tempPassword;
        user.markModified( "password" );

        await tempPasswordObject.deleteOne()
          .then()
          .catch(
            async ( error ) => {
              if( error ){
                console.log( error );
                return res.status( 500 ).json({ error: true, message: "Internal server error" });
              }
            }
          );
      }

      if( !user.isEmailVerified ){
          await UserOTPVerification.deleteMany({ userId: user._id });
          await sendOTPVerificationEmail({ _id: user._id, email: user.email, }, null, next );

          return res.status( 401 ).json({ error: true, message: "Email verification is required please check your inbox" });
      }

      if( !user.trustedIps.includes( req.body.ip ) ){
        await UserOTPVerification.deleteMany({ userId: user._id });
        await User.updateOne({ _id: user._id }, { isLoggedInIpTrusted: false });
        await sendOTPVerificationEmail({ _id: user._id, email: user.email, }, null, next );

        return res.status( 401 ).json({ error: true, isLoggedInIpTrusted: false, message: "Your device Id is not trusted, therefore verification code send to your email" });
      }

      if( 
        user.trustedIps.includes( req.body.ip )
        && user.isEmailVerified
        && !( user.isLoggedInIpTrusted )
      ){
        await User.updateOne({ _id: user._id }, { isLoggedInIpTrusted: true });
        await UserOTPVerification.deleteMany({ userId: user._id });
      }

      if( user.deactivation.isDeactive ){
        user.deactivation.isDeactive = false;
        user.deactivation.deactivationDate = null;
        user.deactivation.isAboutToDelete = false;
        user.deactivation.markModified( "deactivation" );
        user.save(( err ) => { if( err ){ console.error('ERROR: While Update!'); } });
      }
      
      const { accessToken, refreshToken } = await generateTokens( user );
      const userRoleId = user.authRole ? user.authRole : 0;
      user.save(
        ( err ) => {
            if( err ){
                return res.status( 500 ).json({ error: true, message: "ERROR: while saving one time password", errorData: err });
            }
        }
      );
      await TempPassword.deleteMany({ userId: user._id.toString() });
      
      return res.status( 200 ).json(
        {
          error: false,
          isLoggedInIpTrusted: user.isLoggedInIpTrusted,
          isEmailVerified: user.isEmailVerified,
          roleId: userRoleId,
          accessToken,
          refreshToken,
          message: "Logged In Successfully"
        }
      );
    }catch( err ){
      console.log( err );
      return res.status( 500 ).json({ error: true, message: err.message });
    }
}

export default logInController;