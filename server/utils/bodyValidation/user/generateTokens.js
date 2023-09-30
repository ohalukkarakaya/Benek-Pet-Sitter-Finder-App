import jwt from "jsonwebtoken";
import UserToken from "../../../models/UserToken.js" ;

const generateTokens = async ( user ) => {
    try{
        const payload = {
            _id: user._id,
            roles: user.authRole ? user.authRole : 0
        }
        const accessToken = jwt.sign(
                                    payload,
                                    process.env.ACCESS_TOKEN_PRIVATE_KEY,
                                    { expiresIn: "5m" }
                                );
        const refreshToken = jwt.sign(
                                    payload,
                                    process.env.REFRESH_TOKEN_PRIVATE_KEY,
                                    { expiresIn: "60d" }
                                 );

        const userToken = await UserToken.findOne({ userId: user._id });
        if( userToken ) await userToken.remove();

        await new UserToken(
                        {
                            userId: user._id,
                            isCareGiver: user.isCareGiver,
                            isEmailVerified: user.isEmailVerified,
                            isPhoneVerified: user.isPhoneVerified,
                            token: refreshToken
                        }
                  ).save();
        return Promise.resolve(
                            {
                                accessToken,
                                refreshToken
                            }
                       );
    }catch( err ){
        return Promise.reject( err );
    }
};

export default generateTokens;