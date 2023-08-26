import Story from "../../../../../models/Story.js";
import dotenv from "dotenv";

dotenv.config();

const likeStoryController = async (req, res) => {
    try{
        const storyId = req.params.storyId;
        if(!storyId){
            return res.status( 400 )
                      .json(
                            {
                                error: true,
                                message: "storyId is required"
                            }
                      );
        }

        const story = await Story.findById( storyId );
        if( !story ){
            return res.status( 404 )
                      .json(
                            {
                                error: true,
                                message: "Story couldn't found"
                            }
                      );
        }

        let likes = story.likes;
        const isAlreadyLiked = likes.find(
                                       userId => 
                                          userId === req.user
                                                        ._id
                                                        .toString()
                                     );

        

        if( isAlreadyLiked ){
            story.likes = likes.filter(
                userId => userId !== req.user._id.toString()
            );
        }else{
            // story.likes = [...new Set( likes )];

            story.likes
                 .push(
                    req.user
                       ._id
                       .toString()
                 );
        }

        story.markModified( 'likes' );
        story.save(
            ( err ) => {
                if( err ){
                  console.log( "error", err );
                  return res.status( 500 )
                            .json(
                                {
                                error: true,
                                message: "An error occured while saving to database"
                                }
                            );
                }
              }
        );

        return res.status(200).json(
            {
                error: false,
                message: "Story liked or like removed succesfully"
            }
        );
    }catch( err ){
        console.log("ERROR: like story - ", err);
        return res.status(500).json(
            {
                error: true,
                message: "Internal server error"
            }
        );
    }
}

export default likeStoryController;