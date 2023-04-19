import User from "../../../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const userUpdateBirthDayController = async (req, res) => {
    try{
        const birthDay = req.body.birthday;
        if( !birthDay ){
          return res.status( 400 ).json(
            {
              error: true,
              message: "Missing param"
            }
          );
        }
  
        const user = await User.findById( req.user._id.toString() );
        if( !user || user.deactivation.isDeactive ){
          return res.status( 404 ).json(
            {
              error: true,
              message: "User not found"
            }
          );
        }
  
        user.identity.birthday = birthDay;
        user.markModified("identity");
        user.save(
          (err) => {
            if(err){
                return res.status( 500 ).json(
                    {
                        error: true,
                        message: "ERROR: while saving user"
                    }
                );
            }
          }
        );
    }catch(err){
        console.log("Error: add birthday", err);
        return res.status(500).json(
          {
            error: true,
            message: "Internal server error"
          }
        );
    }
}

export default userUpdateBirthDayController;