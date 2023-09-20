import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const finishCareGiveController = async ( req, res ) => {
    try{
        const careGiveId = req.params.careGiveId;
        const actionCodePassword = req.body.actionCodePassword;
        const petOwnerIdFromCode = req.body.petOwnerIdFromCode;
        const petIdFromCode = req.body.petIdFromCode;
        const careGiverIdFromCode = req.body.careGiverIdFromCode;
        const codeType = req.body.codeType;
        const userId = req.user._id.toString();
        if(
            !careGiveId
            || !actionCodePassword
            || !petOwnerIdFromCode
            || !petIdFromCode
            || !careGiverIdFromCode
            || !codeType
        ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "missing params"
                           }
                       );
        }

        if( codeType !== "Finish" ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "This is not a finish code"
                           }
                       );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Care give not found"
                           }
                       );
        }

        if( userId !== careGive.petOwner.petOwnerId.toString() ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "care giver should scan this code"
                           }
                       );
        }

        const pet = await Pet.findById( careGive.petId.toString() );
        if( !pet ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Pet not found"
                           }
                       );
        }

        const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );
        if( 
            !careGiver 
            || careGiver.deactivation.isDeactive
            || careGiver.blockedUsers
                        .includes( 
                            careGive.petOwner
                                    .petOwnerId
                                    .toString() 
                        )
        ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "Care giver not found"
                           }
                       );
        }

        const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString() );
        if(
            !petOwner
            || petOwner.deactivation.isDeactive
            || petOwner.blockedUsers.includes( userId )
        ){
            return res.status( 404 )
                      .json(
                           {
                               error: true,
                               message: "pet owner not found"
                           }
                       );
        }

        if(
            pet._id.toString() !== petIdFromCode
            || careGiver._id.toString() !== careGiverIdFromCode
            || req.user._id.toString() !== petOwnerIdFromCode
        ){
            return res.status( 400 )
                      .json(
                           {
                               error: true,
                               message: "data in code is invalid"
                           }
                       );
        }

        const verifiedPassword = await bcrypt.compare(
            actionCodePassword,
            careGive.invitation.actionCode.codePassword
        );
        if( !verifiedPassword ){
            return res.status( 403 )
                      .json(
                           {
                               error: true,
                               message: "Invalid password"
                           }
                       );
        }

        careGive.invitation.actionCode.codeType = "Done";
        careGive.invitation.actionCode.codePassword = "-";
        careGive.invitation.actionCode.codePassword = "_";
        careGive.markModified( "invitation" );

        careGive.finishProcess.isFinished = true;
        careGive.finishProcess.finishDate = Date.now();
        careGive.markModified( "finishProcess" );

        careGive.save()
                .then(
                    async (_) => {
                        return res.status( 200 )
                                  .json(
                                       {
                                           error: false,
                                           message: "Care give finished succesfully"
                                       }
                                   );
                    }
                ).catch(
                    ( error ) => {
                        if( error ){
                            console.log( error );
                            return res.statu( 500 )
                                      .json(
                                           {
                                               error: true,
                                               message: "Internal server error"
                                           }
                                       );
                        }
                    }
                );
    }catch( err ){
        console.log( "ERROR: finish care give", err );
        return res.status( 500 )
                  .json(
                      {
                          error: true,
                          message: "Internal server error"
                      }
                  );
    }
}

export default finishCareGiveController;