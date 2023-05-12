import User from "../../../models/User.js";
import Pet from "../../../models/Pet.js";
import CareGive from "../../../models/CareGive/CareGive.js";

const getCareGiveController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const careGiveId = req.params.caraGiveId;

        if( !careGiveId ){
            return res.status( 400 ).json(
                {
                    error: true,
                    message: "Missing Params"
                }
            );
        }

        var careGive = await CareGive.findById( careGiveId );

        if( !careGive ){
            return res.status( 404 ).json(
                {
                    error: true,
                    message: "CareGive Not Found"
                }
            );
        }

        if(

            userId !== careGive.invitation
                               .careGiver
                               .careGiverId
                               .toString()

            && userId !== careGive.petOwner
                                  .petOwnerId
                                  .toString()

        ){
            return res.status( 401 ).json(
                {
                    error: true,
                    message: "UnAuthorized"
                }
            );
        }
        
        const careGiver = await User.findById( careGive.careGiver.careGiverId.toString() );
        const careGiverInfo = {
            userId: careGiver._id
                                .toString(),
            userProfileImg: careGiver.profileImg
                                        .imgUrl,
            username: careGiver.userName,
            userFullName: `${
                    careGiver.identity
                                .firstName
                } ${
                    careGiver.identity
                                .middleName
                } ${
                    careGiver.identity
                                .lastName
                }`.replaceAll( "  ", " ")
        }

        const petOwner = await User.findById( careGive.petOwner.petOwnerId.toString() );
        const petOwnerInfo = {
            userId: petOwner._id
                            .toString(),
            userProfileImg: petOwner.profileImg
                                    .imgUrl,
            username: petOwner.userName,
            userFullName: `${
                    petOwner.identity
                            .firstName
                } ${
                    petOwner.identity
                            .middleName
                } ${
                    petOwner.identity
                            .lastName
                        }`.replaceAll( "  ", " ")
        }

        const pet = await Pet.findById( careGive.petId.toString() );
        const petInfo = {
            petId: pet._id.toString(),
            petProfileImgUrl: pet.petProfileImg.imgUrl,
            petName: pet.name,
            sex: pet.sex,
            birthDay: pet.birthDay,
            kind: pet.kind,
            species: pet.species,
            handoverCount: pet.handOverRecord.length
        }

        let careGiveRoleId;
        if( userId === petOwner._id.toString() ){
            careGiveRoleId = 1;
        }else if( userId === careGiver._id.toString() ){
            careGiveRoleId = 2;
        }

        let code;
        if( 
            (
                careGive.invitation
                        .actionCode
                        .codeType === "Start"
                && userId === petOwner._id.toString()
            )
            || (
                careGive.invitation
                    .actionCode
                    .codeType === "Finish"
                && userId === careGiver._id.toString()
            )
        ){
            code = {
                codeType: careGive.invitation
                                    .actionCode
                                    .codeType,
                code: careGive.invitation
                                .actionCo
                                .code
            };
        }

        let price;
        if(
            careGive.prices.priceType !== "Free"
        ){
            price = `${careGive.prices.servicePrice} ${careGive.prices.priceType}`;
        }else{
            price = careGive.prices.priceType;
        }

        const careGiveInfo = {
            id: careGive._id.toString(),
            careGiveRoleId: careGiveRoleId,
            careGiverContact: careGive.careGiver
                                      .careGiverContact,
            petOwnerContact: careGive.petOwner
                                     .petOwnerContact,
            careGiver: careGiverInfo,
            petOwner: petOwnerInfo,
            pet: petInfo,
            startDate: careGive.startDate,
            endDate: careGive.endDate,
            adress: careGive.adress,
            actionCode: code,
            isStarted: careGive.isStarted,
            isFinished: careGive.finishProcess
                                .isFinished,
            finish: careGive.finishProcess
                            .finishDate,
            price: price,
            missionCount: careGive.missionCallender
                                  .length
        }

        careGive = careGiveInfo;

        return res.status( 200 ).json(
            {
                error: false,
                message: "CareGive List Prepared Succesfully",
                totalCareGiveCount: totalCareGiveCount,
                careGiveList: careGives,
            }
        );
    }catch( err ){
        console.log("ERROR: getCareGiveController - ", err);
        res.status(500).json(
            {
                error: true,
                message: "Internal Server Error"
            }
        );
    }
} 

export default getCareGiveController;