import User from "../../../models/User.js";

import { resetPasswordBodyValidation } from "../../../utils/bodyValidation/user/userSettingsRequestsValidationSchema.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const resetPasswordController = async (req, res) => {
    try{
        const { error } = resetPasswordBodyValidation( req.body );
        if( error ){
            return res.status( 400 )
                      .json(
                          {
                              error: true,
                              message: error.details[ 0 ]
                                            .message
                          }
                      );
        }

        if(
            req.body
               .oldPassword !== req.body
                                   .oldPasswordReply
        ){
            return res.status( 400 )
                      .json(
                          {
                            error: true,
                            message: "old passwords are not same"
                          }
                      );
        }

        const user = await User.findById( 
                                        req.user
                                           ._id 
                                );
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

        const verifiedPassword = await bcrypt.compare(
            req.body.oldPassword,
            user.password
        );
        if( !verifiedPassword ){
            return res.status( 401 )
                      .json(
                          {
                            error: true,
                            message: "invalid password"
                          }
                      );
        }

        const salt = await bcrypt.genSalt(
                                        Number(
                                            process.env
                                                   .SALT
                                        )
                                  );

        const hashPassword = await bcrypt.hash(
                                            req.body
                                               .newPassword, 
                                            salt
                                          );

        user.password = hashPassword;
        user.markModified( "password" );
        user.save(
            ( err ) => {
                if( err ){
                    return res.status( 500 )
                              .json(
                                  {
                                      error: true,
                                      message: "ERROR: while saving new password"
                                  }
                              );
                }
            }
        );

        return res.status( 200 )
                  .json(
                        {
                            error: false,
                            message: "Password changed successfully"
                        }
                  );
    }catch(err){
      console.log("ERROR: resetPassword - ", err);
      return res.status( 500 )
                .json(
                    {
                        error: true,
                        message: "Internal server error"
                    }
                );
    }
}

export default resetPasswordController;