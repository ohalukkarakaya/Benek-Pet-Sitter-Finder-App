import dotenv from "dotenv";

dotenv.config();

const insertPetsImagesController = async (req, res) => {
    try{
        var urlList = [];
        for(var i = 0; i < req.imageNames.length; i ++){
          urlList.push(`${process.env.CDN_SUBDOMAIN}${req.imageNames[i]}`);
          req.pet.images.push(
            {
              imgUrl: `${process.env.CDN_SUBDOMAIN}${req.imageNames[i]}`
            }
          );
        }
        if(urlList.length !== 0){
          req.pet.markModified('images');
          req.pet.save(
            function (err) {
              if(err) {
                  console.error(err);
              }
            }
          );
          return req.res.status(200).json(
            {
              error: false,
              data: urlList
            }
          );
        }
      }catch(err){
          console.log(err);
          res.status(500).json(
              {
                  error: true,
                  message: "Internal Server Error"
              }
          );
      }
}

export default insertPetsImagesController;