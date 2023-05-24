import User from "../../../models/User.js";
import UserOTPVerification from "../../../models/UserOtpVerification.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const verifyOtpController = async (req, res) => {
    try{
      let { 
          userId, 
          otp, 
          ip } = req.body;
      
      if(
        !userId 
        || !otp 
        || !ip
      ){
        return res.status( 400 )
                  .json(
                    {
                      error: true,
                      message: "Empty otp details are not allowed"
                    }
                  );
      }
      const UserOTPVerificationRecords = await UserOTPVerification.find(
        {
          userId,
        }
      );

      if(
        UserOTPVerificationRecords.length <= 0
      ){
        //no record found
        return res.status(404 )
                  .json(
                    {
                      error: true,
                      message: "Account record doesn't exist or has been verified already"
                    }
                  );
      }
      //user otp record exists
      const { expiresAt } = UserOTPVerificationRecords[ 0 ];
      const hashedOTP = UserOTPVerificationRecords[ 0 ].otp;

      if( expiresAt < Date.now() ){
        //user Otp record has expired
        await UserOTPVerification.deleteMany({ userId });
        res.status( 405 )
           .json(
              {
                error: true,
                message: "Code has expired. Please request again"
              }
            );
      }

      const validOTP = await bcrypt.compare(
                                            otp, 
                                            hashedOTP
                                      );

        if( !validOTP ){
          //supplied OTP is wrong
          return res.status( 406 )
                    .json(
                      {
                        error: true,
                        message: "Invalid code passed. Check your inbox"
                      }
                    );
        }
        await User.findOne(
          { _id: userId },
          async ( err, user ) => {
            if( err ){
              res.status( 404 )
                 .json(
                    {
                      error: true,
                      message: "User not found"
                    }
                  );
            }
            if(
              !user.trustedIps
                   .includes( ip ) 
              && user.isLoggedInIpTrusted
            ){
              return res.status( 405 )
                        .json(
                          {
                            error: true,
                            message: "Ip is not trusted. Please try to login from your device"
                          }
                        );
            }else if(
              !user.trustedIps
                   .includes(ip) 
              && !user.isLoggedInIpTrusted 
              && user.isEmailVerified
            ){
              await User.updateOne(
                          { _id: userId },
                          { 
                            $push: { 
                              trustedIps: ip 
                            } 
                          }
                         );
              await User.updateOne(
                { _id: userId }, 
                { isLoggedInIpTrusted: true }
              );
              await UserOTPVerification.deleteMany({ userId });
              return res.status( 200 )
                        .json(
                          {
                            error: false,
                            message: "Ip verified succesfuly"
                          }
                        );
            }
            //success
            await User.updateOne(
                          { _id: userId }, 
                          { isEmailVerified: true }
                       );

            await UserOTPVerification.deleteMany({ userId });
            return res.status( 200 )
                      .json(
                        {
                          error: false,
                          message: "User email verified succesfuly"
                        }
                      );
          }
        ).clone();
    }catch( err ){
      console.log( "ERROR: verifyOtpController - ", err );
      return res.status( 500 )
                .json(
                  {
                    error: true,
                    message: "Internal server error"
                  }
                );
    }
}

export default verifyOtpController;