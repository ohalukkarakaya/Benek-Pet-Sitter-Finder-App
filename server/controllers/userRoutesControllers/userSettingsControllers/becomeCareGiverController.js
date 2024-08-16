import User from "../../../models/User.js";

import mokaRegisterSubsellerRequest from "../../../utils/mokaPosRequests/mokaSubsellerRequests/mokaRegisterSubsellerRequest.js";

import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const becomeCareGiverController = async ( req, res ) => {
    try{
        const userId = req.user
                          ._id
                          .toString();

        const user = await User.findById( userId );

        if(
          !user 
          || user.deactivation
                 .isDeactive
        ){
          return res.status( 404 )
                    .json(
                      {
                        error: true,
                        message: "User couldn't found"
                      }
                    );
        }
  
        const isCareGiver = user.isCareGiver;
  
        if( !isCareGiver ){
  
          const iban = user.iban;
          if( !iban ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You haveto insert iban firstly"
                        }
                      );
          }
  
          
          //decrypt national id number
          const recordedNationalId = user.identity.nationalId;
          if( !recordedNationalId ){
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Insert National Id No First"
                        }
                      );
          }
          const recordedIv = user.identity.nationalId.iv;
          if( !recordedIv ){
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal server error"
                        }
                      );
          }
  
          const cryptedNationalId = user.identity.nationalId.idNumber;
          if( !cryptedNationalId ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You haveto insert your id number or passport number firstly"
                        }
                      );
          }
  
          const iv = Buffer.from( recordedIv, 'hex' );
          const decipher = crypto.createDecipheriv(
                                                process.env.NATIONAL_ID_CRYPTO_ALGORITHM, 
                                                Buffer.from( process.env.NATIONAL_ID_CRYPTO_KEY ), 
                                                iv
                                  );
  
          let nationalIdNo = decipher.update( cryptedNationalId, 'hex', 'utf8' );
          nationalIdNo += decipher.final( 'utf8' );
          //national id number decrypted
  
          const phoneNumber = user.phone;
          if( !phoneNumber ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You have to insert phone number firstly"
                        }
                      );
          }
  
          const email = user.email;
          if( !email ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You have to insert email firstly"
                        }
                      );
          }
  
          const firstName = user.identity
                                .firstName;
          if( !firstName ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You have to insert firstName"
                        }
                      );
          }
  
          const middleName = user.identity
                                 .middleName;
  
          const lastName = user.identity
                               .lastName;
          if( !lastName ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You have to insert lastname"
                        }
                      );
          }
  
          const openAdress = user.identity
                                 .openAdress;
          if( !openAdress ){
            return res.status( 400 )
                      .json(
                        {
                          error: true,
                          message: "You have to insert openAdress"
                        }
                      );
          }
  
          const mokaRequest = await mokaRegisterSubsellerRequest(
                                        firstName,
                                        middleName,
                                        lastName,
                                        email,
                                        nationalIdNo,
                                        phoneNumber,
                                        openAdress,
                                        iban
                                     );
  
          if( !mokaRequest ){

            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal server error"
                        }
                      );

          }
  
          if( mokaRequest.error ){

            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: mokaRequest.data
                                              .sonucStr
                        }
                      );
          }
  
          if( 
            mokaRequest.data.sonuc !== 1
          ){

            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal server error",
                          data: mokaRequest.data
                                           .sonucStr
                        }
                      );
          }
  
          user.careGiveGUID = mokaRequest.data.altUyeIsyeriData.DealerCode.toString();
          user.markModified( "careGiveGUID" );
  
        } else {

          const careGiverGUID = user.careGiveGUID;
          if( !careGiverGUID ){
            user.isCareGiver = false;
            user.markModified( "isCareGiver" );
            user.save(
              ( err ) => {
                console.log( "ERROR: Save User - ", err );
                return res.status( 500 )
                          .json(
                            {
                              error: true,
                              message: "Internal Server Error"
                            }
                          );
              }
            );
            console.log(
                      `user with id ${
                                      user._id
                                          .toString()
                                    } shouldn't be careGiver`
                    );
            return res.status( 500 )
                      .json(
                        {
                          error: true,
                          message: "Internal server error"
                        }
                      );
          }
  
          return res.status( 400 )
                    .json(
                      {
                        error: true,
                        message: "User Is Already CareGiver"
                      }
                    );
        }

        user.isCareGiver = true;
        user.markModified("isCareGiver");
        user.save(
          ( err ) => {
            if( err ){
                return res.status( 500 )
                          .json(
                              {
                                  error: true,
                                  message: "ERROR: while saving user"
                              }
                          );
            }
          }
        );
  
        return res.status( 200 )
                  .json(
                    {
                      error: false,
                      message: "Became Caregiver Operation Successful"
                    }
                  );
    }catch( err ){
        console.log( "Error: becomeCareGiverController - ", err );
        return res.status( 500 )
                  .json(
                    {
                      error: true,
                      message: "Internal server error"
                    }
                  );
    }
}

export default becomeCareGiverController;