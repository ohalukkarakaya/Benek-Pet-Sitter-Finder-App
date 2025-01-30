import Pet from "../../../models/Pet.js";


const getPetPhotosByIdController = async ( req, res ) => {
    try{
        const petId = req.params.petId;
        const pet = await Pet.findById( petId );

        if( !pet ){
            return res.status( 404 ).json({
                error: true,
                message: "Pet not found"
            });
        }

        const images = pet.images;
        let photos = [];
        for( let image of images ){
            let photo = { _id: image._id, imgUrl: image.imgUrl };
            photos.push( photo );
        }

        return res.status( 200 ).json({
            error: false,
            photos: photos
        });

    }catch ( err ){
        console.log("ERROR: getPetPhotosByIdController - ", err);
        return res.status( 500 ).json({
            error: true,
            message: "Internal Server Error"
        });
    }
}

export default getPetPhotosByIdController;