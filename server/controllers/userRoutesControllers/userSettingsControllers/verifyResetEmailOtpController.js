import User from "../../../models/User.js";
import ChangeEmailOTP from "../../../models/UserSettings/ChangeEmail.js";
import UserOtpVerification from "../../../models/UserOtpVerification.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const verifyResetEmailOtpController = async ( req, res ) => {
    try{
        const email = req.body.email
        const otp = req.body.otp;
        if( 
          !otp
          || !email 
        ){
          return res.status( 400 )
                    .json(
                        {
                          error: true,
                          message: "Empty otp details are not allowed"
                        }
                    );
        }

        const changeEmailOTPVerificationRecords = await ChangeEmailOTP.find(
                                                                          {
                                                                            userId : req.user
                                                                                        ._id
                                                                                        .toString(),
                                                                            newEmail: email
                                                                          }
                                                                       );

        if( changeEmailOTPVerificationRecords.length <= 0 ){
          //no record found
          return res.status( 404 )
                    .json(
                        {
                          error: true,
                          message: "Account record doesn't exist or has been verified already"
                        }
                    );
        }
        //user otp record exists
        const { expiresAt } = changeEmailOTPVerificationRecords[ 0 ];
        const hashedOTP = changeEmailOTPVerificationRecords[ 0 ].otp;

        if( 
          expiresAt < Date.now()
        ){
          //user Otp record has expired
          await ChangeEmailOTP.deleteMany(
                                      { 
                                        userId: req.user
                                                   ._id
                                                   .toString()
                                      }
                               );
          return res.status( 405 )
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
        const user =  await User.findOne(
            { 
              _id: req.user
                      ._id
                      .toString() 
            }
        );

        if( 
          !user 
          || user.deactivation
                 .isDeactive
        ){
          res.status( 404 )
             .json(
                {
                    error: true,
                    message: "User not found"
                }
             );
        }

        //success
        await User.updateOne(
          {
              _id: req.user
                      ._id
                      .toString()
          },
          {
              email: changeEmailOTPVerificationRecords[ 0 ].newEmail
          }
        ).then(
          async ( updatedUser ) => {

            await ChangeEmailOTP.deleteMany(
              {
                  userId: req.user
                             ._id
                             .toString()
              }
            ).then(
              (_) => {
                return res.status( 200 )
                      .json(
                        {
                          message: "Email updated succesfuly"
                        }
                      );
              }
            ).catch(
              ( err ) => {
                console.log( "ERROR: verifyResetEmailOtpController - ", err );
                return res.status( 500 )
                          .json(
                            {
                              error: true,
                              message: "Internal Server Error"
                            }
                          );
              }
            );
          } 
        ).catch(
          ( err ) => {
            console.log( "ERROR: verifyResetEmailOtpController - ", err );
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal Server Error"
                        }
                      );
          }
        );
    }catch( err ){
        console.log( "ERROR: verifyResetEmailOtpController - ", err );
        return res.status( 500 )
                  .json(
                      {
                        error: true,
                        message: "Internal server error"
                      }
                  );
    }
}

export default verifyResetEmailOtpController;