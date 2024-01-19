import User from "../../../models/User.js";
import BannedUsers from "../../../models/Report/BannedUsers.js";

import sendOTPVerificationEmail from "../../../utils/sendValidationEmail.js";
import { signUpBodyValidation } from "../../../utils/bodyValidation/user/signUpValidationSchema.js";

import generateRandomAvatarHelper from "../../../utils/defaultAvatarHelpers/generateRandomAvatarHelper.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const signUpController = async ( req, res ) => {
    try{
      const { error } = signUpBodyValidation( req.body );
      if( error )
        return res.status( 400 )
                  .json({ 
                    error: true, 
                    message: error.details[ 0 ]
                                  .message 
                  });

      const isUserBanned = await BannedUsers.findOne({ userEmail: req.body.email });
      const user = await User.findOne({ $or: [{ userName: req.body.userName, }, { email: req.body.email }] });

      // hata dön
      if( user )
        return res.status( 400 )
                  .json({ error: true, message: "User Allready Exists" });
      if( isUserBanned )
        return res.status( 200 )
                  .json({ 
                    error: false, 
                    isUserBanned: true, 
                    message: "This User Can't Be Enrolled Again", 
                    desc: isUserBanned.adminDesc 
                  });
  
      const salt = await bcrypt.genSalt( Number( process.env.SALT) );
      const hashPassword = await bcrypt.hash( req.body.password, salt );

      // default profile image oluştur
      const assetIdiesJson = generateRandomAvatarHelper( false );
      const avatarAssetId = assetIdiesJson.avatarId;
      const backGroundAssetId = assetIdiesJson.backGroundId;

      const genderId = req.body.gender === "Male" ? "M" : "F";

      const defaultAvatar = `${genderId}/${backGroundAssetId}/${avatarAssetId}`;
  
      await new User({ userName: req.body.userName, email: req.body.email, gender: req.body.gender, defaultImage: defaultAvatar, identity: req.body.identity, location: req.body.location, password: hashPassword, trustedIps: [ req.body.ip ]})
       .save() // Handle account verification, send verification code
       .then( 
        ( result ) => { 
          sendOTPVerificationEmail( 
            { 
              _id: result._id, 
              email: result.email 
            }, 
            res 
          ); 
        }
       );


    }catch(err){
      console.log( "ERROR: signUpController - ", err );
      return res.status( 500 )
                .json({ 
                  error: true, 
                  message: "Internal Server Error" 
                });
    }
}

export default signUpController;