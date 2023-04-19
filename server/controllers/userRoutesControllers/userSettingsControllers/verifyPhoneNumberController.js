import User from "../../../models/User.js";
import PhoneOtpVerification from "../../../models/UserSettings/PhoneOTPVerification.js";

import { verifyOTPVerificationSMS } from "../../../utils/sendValidationSMS.js";
import { verifyPhoneBodyValidation } from "../../../utils/bodyValidation/user/addPhoneNumberValidationSchema.js";

import dotenv from "dotenv";

dotenv.config();

const verifyPhoneNumberController = async (req, res) => {
    try{
        const { error } = verifyPhoneBodyValidation( req.body );
        if(error){
          console.log("validation error - ", error);
          return res.status(400).json(
            {
              error: true,
              messaage: error
            }
          );
        }
  
        let { phoneNumber, otp } = req.body;
  
        const user = await User.findById( req.user._id );
        if(!user || user.deactivation.isDeactive){
          return res.status(404).json(
            {
              error: true,
              message: "User couldn't found"
            }
          );
        }
  
        const verificationObject = await PhoneOtpVerification.findOne(
          {
            userId: req.user._id.toString(),
            phoneNumber: `+${phoneNumber}`
          }
        );
        if(!verificationObject){
          return res.status(404).json(
            {
              error: true,
              message: "Verification didn't request for this phone number"
            }
          );
        }
  
        verifyOTPVerificationSMS(
          {
            _id: req.user._id.toString(),
            phone: phoneNumber,
            otp: otp
          },
          res
        );
        
      }catch(err){
        console.log("Error: add phone number", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
      }
}

export default verifyPhoneNumberController;