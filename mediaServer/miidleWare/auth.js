require('dotenv').config();

const auth = async ( req, res, next ) => {
    try{
        const privateKey = req.header( "private-key" )

        if( !privateKey ){
            return res.status( 401 )
                      .json(
                        {
                            error: true,
                            message: "Un Authorized"
                        }
                      );
        }

        if( privateKey !== process.env.PRIVATE_KEY ){
            return res.status( 401 )
                      .json(
                        {
                            error: true,
                            message: "Un Authorized"
                        }
                      );
        }

        next();
    }catch( err ){
        console.log( "ERROR: auth error - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                  )
    }
}

module.exports = auth;