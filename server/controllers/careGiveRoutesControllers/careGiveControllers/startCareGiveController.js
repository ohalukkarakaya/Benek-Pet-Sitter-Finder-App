import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import QRCode from "qrcode";

dotenv.config();

const startCareGiveController = async (req, res) => {
    try{
        const careGiveId = req.params
                              .careGiveId;

        const actionCodePassword = req.body
                                      .actionCodePassword;

        const petOwnerIdFromCode = req.body
                                      .petOwnerIdFromCode;

        const petIdFromCode = req.body
                                 .petIdFromCode;

        const careGiverIdFromCode = req.body
                                       .careGiverIdFromCode;

        const codeType = req.body
                            .codeType;

        const userId = req.user
                          ._id
                          .toString();

        if(
            !careGiveId
            || !actionCodePassword
            || !petOwnerIdFromCode
            || !petIdFromCode
            || !careGiverIdFromCode
            || !codeType
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "missing params"
                }
            );
        }

        if( codeType !== "start" ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "This is not a start code"
                }
            );
        }

        const careGive = await CareGive.findById( careGiveId );
        if( !careGive ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Care give not found"
                }
            );
        }
        if(
            userId !== careGive.careGiver
                               .careGiverId
                               .toString()
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "care giver should scan this code"
                }
            );
        }

        const pet = await Pet.findById(
                                    careGive.petId
                                            .toString()
                              );
        if( !pet ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "Pet not found"
                }
            );
        }

        const careGiver = await User.findById( userId );
        if(
            !careGiver 

            || careGiver.deactivation
                        .isDeactive

            || careGiver.blockedUsers
                        .includes(
                            careGive.petOwner
                                    .petOwnerId
                                    .toString()
                        )
        ){
            return res.status(404).json(
                {
                    error: true,
                    message: "Care giver not found"
                }
            );
        }

        const petOwner = await User.findById(
                                        careGive.petOwner
                                                .petOwnerId
                                                .toString()
                                    );

        if(
            !petOwner

            || petOwner.deactivation
                       .isDeactive

            || petOwner.blockedUsers.includes( userId )
        ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "pet owner not found"
                }
            );
        }

        if(
            pet._id
               .toString() !== petIdFromCode
               
            || userId !== careGiverIdFromCode

            || petOwner._id
                       .toString() !== petOwnerIdFromCode
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "data in code is invalid"
                }
            );
        }

        if(
            Date.parse( careGive.startDate ) > Date.now()
            || Date.parse( careGive.startDate ) < Date.now()
        ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "care give was past"
                }
            );
        }

        const verifiedPassword = await bcrypt.compare(
            actionCodePassword,

            careGive.invitation
                    .actionCode
                    .code
        );

        if( !verifiedPassword ){
            return res.status( 403 ).json(
                {
                    error: true,
                    message: "Invalid password"
                }
            );
        }

        //generate password
        const randPassword = crypto.randomBytes( 10 )
                                   .toString( 'hex' );

        const salt = await bcrypt.genSalt( 
                                    Number( 
                                        process.env
                                               .SALT
                                    ) 
                                );
        const hashCodePassword = await bcrypt.hash(
            randPassword, 
            salt
        );

        //qr code data
        const data = {
            careGiveId: invitedCareGive._id.toString(),
            petOwner: req.user._id.toString(),
            careGiver: invitedCareGive.careGiver.careGiverId.toString(),
            pet: invitedCareGive.petId.toString(),
            codeType: "Start",
            codePassword: randPassword,
        }

        let qrCodeData = JSON.stringify( data );

        // Get the base64 url
        QRCode.toDataURL(
            qrCodeData,
            function ( err, url ) {
                if( err ){
                    return res.status(500).json(
                        {
                            error: true,
                            message: "error wile generating QR code"
                        }
                    );
                }

                careGive.actionCode.codeType = "Finish";
                careGive.actionCode.codePassword = hashCodePassword;
                careGive.actionCode.code = url;
                careGive.markModified("actionCode");

                careGive.isStarted = true;
                careGive.markModified("isStarted");

                careGive.save().then(
                    (carGiveObject) => {
                        return res.status(200).json(
                            {
                                error: false,
                                message: "care give started succesfully",
                                finishCode: url
                            }
                        );
                    }
                ).catch(
                    (er) => {
                        console.log(er);
                        return res.status(500).json(
                            {
                                error: true,
                                message: "Internal server error"
                            }
                        );
                    }
                );
            }
        );
    }catch(err){
        console.log("Error: start care give - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default startCareGiveController;