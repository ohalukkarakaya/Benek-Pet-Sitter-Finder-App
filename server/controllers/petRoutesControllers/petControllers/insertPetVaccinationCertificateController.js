import dotenv from "dotenv";

dotenv.config();

const insertPetVaccinationCertificateController = async (req, res) => {
    try{
        if(req.cdnUrl){
          req.pet.vaccinations.push(
            {
              desc: req.body.desc,
              fileUrl: req.cdnUrl
            }
          );
          req.pet.markModified('vaccinations');
          req.pet.save(
            function (err) {
              if(err) {
                  console.error('ERROR: While Update!');
              }
            }
          );
          return req.res.status(200).json(
            {
              error: false,
              url: req.cdnUrl,
              desc: req.body.desc
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

export default insertPetVaccinationCertificateController;