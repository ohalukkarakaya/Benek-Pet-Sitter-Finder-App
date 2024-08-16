import User from "../../../models/User.js";

import validateTcNo from "../../../utils/tcNoValidate.js";
import validator from "validator";

import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const addIdNumberController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();

        const isCitizenOfTurkey = req.body.isTCCitizen;
        const idNo = req.body.idNo;
        const passportCountryCode = req.body.countryCode
        if(
          !idNo 
          || !isCitizenOfTurkey
          || ( isCitizenOfTurkey === "false" && !passportCountryCode )
        ){
          return res.status( 400 ).json({
            error: true,
            message: "Missing required params"
          });
        }

        const isTCCitizen = isCitizenOfTurkey === "true";  
        const trimedIdNo = idNo.toString().replaceAll( " ", "" ).toUpperCase();
        const isTcNo = validateTcNo( trimedIdNo );
        let isPassportNo = false;
        if( !isTCCitizen && passportCountryCode ){
          isPassportNo = validator.isPassportNumber( trimedIdNo, passportCountryCode );
        }
  
        const nationalIdCryptoKey = process.env.NATIONAL_ID_CRYPTO_KEY;
        const nationalIdCryptoAlgorithm = process.env.NATIONAL_ID_CRYPTO_ALGORITHM;
        const iv = crypto.randomBytes( 16 ).toString( 'hex' );
        const cipher = crypto.createCipheriv(
              nationalIdCryptoAlgorithm,
              Buffer.from( nationalIdCryptoKey ),
              Buffer.from( iv, 'hex' )
        );
        let encrypted = cipher.update( trimedIdNo, 'utf8', 'hex' );
        encrypted += cipher.final( 'hex' );
  
        if( !isTcNo && !isPassportNo ){
          return res.status( 400 ).json({
            error: true,
            message: "Id number is not valid"
          });
        }
        
        const user = await User.findById( userId );
        if( !user || user.deactivation.isDeactive ){
          return res.status( 404 ).json({
            error: true,
            message: "User not found"
          });
        }
  
        if( isTCCitizen ){
          if( !isTcNo || isPassportNo  ){
            return res.status( 400 ).json({
              error: true,
              message: "TC ID No is required for you"
            });
          }
  
        }else if( !isTCCitizen ){
          if( isTcNo || !isPassportNo ){
            return res.status( 400 ).json({
              error: true,
              message: "Passport No is required for you"
            });
          }
        }
  
        //insert ID
        user.identity.nationalId = {};
        user.identity.nationalId.isTcCitizen = isTCCitizen;
        user.identity.nationalId.iv = iv;
        user.identity.nationalId.idNumber = encrypted;

        user.markModified( "identity" );
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
  
        const firstSplicedId = trimedIdNo.slice( 0, 3 );
        const lastSplicedId = trimedIdNo.slice( -2 );
        return res.status( 200 ).json({
          error: false,
          message: `Id number inserted succesfully`,
          idNumber: `${ firstSplicedId }...${ lastSplicedId }`
        });
  
      }catch( err ){
        console.log( "Error: add ID number", err );
        return res.status( 500 ).json({
          error: true,
          message: "Internal server error"
        });
      }
}

export default addIdNumberController;