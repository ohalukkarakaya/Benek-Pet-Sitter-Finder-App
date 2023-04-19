import User from "../../../models/User.js";

import paramUpdateSubSellerRequest from "../../../utils/paramRequests/subSellerRequests/paramUpdateSubSellerRequest.js";

import dotenv from "dotenv";

dotenv.config();

const addAdressController = async (req, res) => {
    try{

        const userId = req.user._id.toString();
  
        const adress = req.body.adress.toString();
        if(!adress){
          return res.status(400).json(
            {
              error: true,
              message: "missing params"
            }
          );
        }
  
        const user = await User.findById( userId );
        if( !user || user.user.deactivation.isDeactive ){
          return res.status(404).json(
            {
              error: true,
              message: "User not found"
            }
          );
        }
  
        if( user.careGiveGUID ){
          const paramRequest = await paramUpdateSubSellerRequest(
            user.careGiveGUID,
            null,
            null,
            null,
            null,
            null,
            adress,
            null
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
        }
  
        user.identity.openAdress = adress;
        user.markModified("identity");
        user.save(
          (err) => {
            if(err){
                return res.status(500).json(
                    {
                        error: true,
                        message: "ERROR: while saving user data"
                    }
                );
            }
          }
        );
  
        return res.status(200).json(
          {
            error: false,
            message: "Adress inserted succesfully"
          }
        );
  
    }catch(err){
        console.log("Error: add adress", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
    }
}

export default addAdressController;