import User from "../../../models/User.js";

import paramUpdateSubSellerRequest from "../../../utils/paramRequests/subSellerRequests/paramUpdateSubSellerRequest.js";

import IBANValidator from "iban-validator-js";
import dotenv from "dotenv";
import crypto from "crypto";
import mokaUpdateSubsellerRequest from "../../../utils/mokaPosRequests/mokaSubsellerRequests/mokaUpdateSubsellerRequest.js";

dotenv.config();

const updateCareGiverPaymentInfoController = async (req, res) => {
    try{
        const name = req.body.name;
        const iban = req.body.iban;
        if( !iban && !name ){
          return res.status( 400 ).json({
            error: true,
            message: "Iban is required"
          });
        }
  
        const user = await User.findById( req.user._id.toString() );

        if( !user || user.deactivation.isDeactive ){
          return res.status( 404 ).json({
            error: true,
            message: "User couldn't find"
          });
        }
  
        if( !( user.identity.firstName && user.identity.lastName) && !name ){
          return res.status( 400 ).json({
            error: true,
            message: "You have to insert official name"
          });
        }
  
        if( name ){
          const splitedName = name.toString().split( " " );
                                  
          if( splitedName.length < 2 ){
            return res.status( 400 ).json({
              error: true,
              message: "You have to send your full name"
            });
          }else if( splitedName.length > 2 ){
            user.identity.middleName = splitedName.slice( 1, -1 ).join( " " );
          }
          
          user.identity.firstName = splitedName[ 0 ];
          user.identity.lastName = splitedName[ splitedName.length - 1 ];
          
          user.markModified( "identity" );
        }
  
        if( !( user.iban ) && !iban ){
          return res.status( 400 ).json({
            error: true,
            message: "You have to insert iban"
          });
        }
  
        if( iban ){
          //validate iban
          const ibanWithoutSpaces = iban.toString().replaceAll( " ", "" ).toUpperCase();

          const ibanValidate = IBANValidator.isValid( ibanWithoutSpaces );
          if( !ibanValidate ){
            return res.status( 400 ).json({
              error: true,
              message: "IBAN is not valid"
            });
          }
  
          user.iban = ibanWithoutSpaces;
          user.markModified( "iban" );
        }
        user.save(
          ( err ) => {
            if( err ){
                return res.status( 500 ).json({
                      error: true,
                      message: "ERROR: while saving user data"
                });
            }
          }
        );
        
        if( user.careGiveGUID ){
          let middleName;
  
          const splitedName = name.toString().split(" ");

            if( splitedName.length > 2 ){
              middleName = splitedName.slice( 1, -1 ).join(" ");
            }
            
            const firstName = splitedName[ 0 ];
            const lastName = splitedName[ splitedName.length - 1 ];

            //decrypt careGiver National IdNo
            const recordedIv = user.identity.nationalId.iv;
            const cryptedNationalId = user.identity.nationalId.idNumber;

            const iv = Buffer.from( recordedIv, 'hex' );
            const decipher = crypto.createDecipheriv(
                process.env.NATIONAL_ID_CRYPTO_ALGORITHM,
                Buffer.from( process.env.NATIONAL_ID_CRYPTO_KEY ),
                iv
            );

            let nationalIdNo = decipher.update( cryptedNationalId, 'hex', 'utf8' );
            nationalIdNo += decipher.final( 'utf8' );

            const mokaRequest = await mokaUpdateSubsellerRequest(
                user.careGiveGUID,
                firstName,
                middleName,
                lastName,
                user.email,
                nationalIdNo,
                user.phone,
                user.identity.openAdress,
                user.iban
            )
  
          if( !mokaRequest ){
            return res.status( 500 ).json({
              error: true,
              message: "Internal server error"
            });
          }
  
          if( mokaRequest.error ){
            return res.status( 500 ).json({
              error: true,
              message: paramRequest.response.data.sonucStr
            });
          }
  
          if( mokaRequest.data.sonuc !== 1 ){
            return res.status( 500 ).json({
              error: true,
              message: "Internal server error",
              data: mokaRequest.data.sonucStr
            });
          }
        }
  
        return res.status( 200 ).json({
          error: false,
          message: "payment Info updated succesfully"
        });
      }catch( err ){
        console.log( "Error: add iban", err );
        return res.status( 500 ).json({
          error: true,
          message: "Internal server error"
        });
      }
}

export default updateCareGiverPaymentInfoController;