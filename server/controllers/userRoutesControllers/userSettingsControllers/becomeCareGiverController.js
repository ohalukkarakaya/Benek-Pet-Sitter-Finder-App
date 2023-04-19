import User from "../../../models/User.js";

import paramRegisterSubSellerRequest from "../../../utils/paramRequests/subSellerRequests/paramRegisterSubSellerRequest.js";
import paramDeleteSubSellerRequest from "../../../utils/paramRequests/subSellerRequests/paramDeleteSubSellerRequest.js";

import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const becomeCareGiverController = async (req, res) => {
    try{
        const user = await User.findById( req.user._id );
        if(!user || user.deactivation.isDeactive){
          return res.status(404).json(
            {
              error: true,
              message: "User couldn't found"
            }
          );
        }
  
        const isCareGiver = user.isCareGiver;
  
        if( !isCareGiver ){
  
          const iban = user.iban.ibanNo;
          if( !iban ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You haveto insert iban firstly"
              }
            );
          }
  
          
          //decrypt national id number
          const recordedIv = user.identity.nationalId.iv;
          if( !recordedIv ){
            return res.status( 500 ).json(
              {
                error: true,
                message: "Internal server error"
              }
            );
          }
  
          const cryptedNationalId = user.identity.nationalId.idNumber;
          if( !cryptedNationalId ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You haveto insert your id number or passport number firstly"
              }
            );
          }
  
          const iv = Buffer.from(recordedIv, 'hex');
          const decipher = crypto.createDecipheriv(
            process.env.NATIONAL_ID_CRYPTO_ALGORITHM, 
            Buffer.from( process.env.NATIONAL_ID_CRYPTO_KEY ), 
            iv
          );
  
          let nationalIdNo = decipher.update( cryptedNationalId, 'hex', 'utf8');
          nationalIdNo += decipher.final('utf8');
          //national id number decrypted
  
          const phoneNumber = user.phone;
          if( !phoneNumber ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You have to insert phone number firstly"
              }
            );
          }
  
          const email = user.email;
          if( !email ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You have to insert email firstly"
              }
            );
          }
  
          const firstName = user.identity.firstName;
          if( !firstName ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You have to insert firstName"
              }
            );
          }
  
          const middleName = user.identity.middleName;
  
          const lastName = user.identity.lastName;
          if( !lastName ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You have to insert lastname"
              }
            );
          }
  
          const openAdress = user.identity.openAdress;
          if( !openAdress ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "You have to insert openAdress"
              }
            );
          }
  
          const birthday = user.identity.birthday.toString();
          if( !birthday ){
            return res.status( 400 ).json(
              {
                error: true,
                message: "Insert birthday firstly"
              }
            );
          }
  
          const paramRequest = await paramRegisterSubSellerRequest(
            firstName,
            middleName,
            lastName,
            birthday,
            nationalIdNo,
            phoneNumber,
            openAdress,
            iban
          );
  
          if( !paramRequest || !(paramRequest.response) ){
            return res.status( 500 ).json(
              {
                error: true,
                message: "Internal server error"
              }
            );
          }
  
          if( paramRequest.response.error ){
            return res.status( 500 ).json(
              {
                error: true,
                message: paramRequest.response.data.sonucStr
              }
            );
          }
  
          if( paramRequest.response.sonuc !== "1" ){
            return res.status( 500 ).json(
              {
                error: true,
                message: "Internal server error",
                data: paramRequest.response.data.sonucStr
              }
            );
          }
  
          user.careGiveGUID = paramRequest.response.data.guidAltUyeIsyeri.toString();
          user.markModified("careGiveGUID");
  
        } else {
          const careGiverGUID = user.careGiveGUID;
          if( !careGiverGUID ){
            console.log(`user with id ${user._id.toString()} shouldn't be careGiver`);
            return res.status( 500 ).json(
              {
                error: true,
                message: "Internal server error"
              }
            );
          }
  
          const paramRequest = await paramDeleteSubSellerRequest( careGiverGUID );
          if( !paramRequest || !(paramRequest.response) ){
            return res.status( 500 ).json(
              {
                error: true,
                message: "Internal server error"
              }
            );
          }
  
          if( paramRequest.response.error ){
            return res.status( 500 ).json(
              {
                error: true,
                message: paramRequest.response.data.sonucStr
              }
            );
          }
  
          if( paramRequest.response.sonuc !== "1" ){
            return res.status( 500 ).json(
              {
                error: true,
                message: "Internal server error",
                data: paramRequest.response.data.sonucStr
              }
            );
          }
  
          user.careGiveGUID.remove();
          user.markModified("careGiveGUID");
  
        }
  
        user.isCareGiver = !isCareGiver;
        user.markModified("isCareGiver");
        user.save(
          (err) => {
            if(err){
                return res.status(500).json(
                    {
                        error: true,
                        message: "ERROR: while saving user"
                    }
                );
            }
          }
        );
  
        return res.status(200).json(
          {
            error: false,
            message: "became caregiver succesfully"
          }
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

export default becomeCareGiverController;