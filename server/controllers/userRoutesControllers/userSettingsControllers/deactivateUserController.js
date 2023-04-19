import User from "../../../models/User.js";
import CareGive from "../../../models/CareGive/CareGive.js";
import UserToken from "../../../models/UserToken.js";

import dotenv from "dotenv";

dotenv.config();

const deactivateUserController = async (req, res) => {
    try{
        const userId = req.user._id.toString();
  
        const user = await User.findById(userId);
        if(!user || user.deactivation.isDeactive){
          return res.status(404).json(
            {
              error: true,
              message: "user not found"
            }
          );
        }
  
        const areThereAnyLinkedCareGive = await CareGive.findOne(
          {
            $or: [
              {
                "careGiver.careGiverId": user._id.toString()
              },
              {
                "petOwner.petOwnerId": user._id.toString()
              }
            ]
          }
        );
  
        if(areThereAnyLinkedCareGive){
          return res.status(400).json(
            {
              error: true,
              messaage: "You have a care give linked to you"
            }
          );
        }
  
        const userToken = await UserToken.findOne(
          {
              token: req.body.refreshToken,
          }
        );
  
        if(userToken){
          await userToken.remove();
        }
  
        if(user.deactive.isDeactive){
          return res.status(400).json(
            {
              error: true,
              message: "user is already deactive"
            }
          );
        }
  
        user.deactivation.isDeactive = true;
        user.deactivation.deactivationDate = Date.now();
        user.deactivation.isAboutToDelete = false;
        user.markModified("deactivation");
        user.save().then(
          (_) => {
            return res.status(200).json(
              {
                error: false,
                message: "User deactivated"
              }
            );
          }
        ).catch(
          (err) => {
            if(err){
              console.log(err);
              return res.status(500).json(
                {
                  error: true,
                  message: "Internal server error"
                }
              );
            }
          }
        );
      }catch(err){
        console.log("Error: deactivate user", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
      }
}

export default deactivateUserController