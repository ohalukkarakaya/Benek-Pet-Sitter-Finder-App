import dotenv from "dotenv";

dotenv.config();

const editPetProfileImageAndCoverImageController = async ( req, res ) => {
    try{
      let successResponse = {};
      if(
        !req.profilePath
        || !req.coverPath
      ){
        return res.status( 400 )
                  .json(
                    {
                      error: true,
                      message: "No File Uploaded"
                    }
                  );
      }

      if( req.profilePath ){
        successResponse.petProfilePath = req.profilePath;
      }

      if( req.coverPath ){
        successResponse.petCoverPath = req.coverPath;
      }

      await req.pet
               .save(
                  function ( err ){
                    if(err) {
                        console.error('ERROR: While Update!');
                    }
                  }
                );

      return res.status( 200 )
                .json(
                  successResponse
                 );

    }catch( err ){
        console.log( "ERROR: editPetProfileImageAndCoverImageController - ", err );
        res.status( 500 )
           .json(
              {
                  error: true,
                  message: "Internal Server Error"
              }
            );
    }
}

export default editPetProfileImageAndCoverImageController;