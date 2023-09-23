import mokaDeleteCard from "../../utils/mokaPosRequests/mokaRegisterCardRequests/mokaCardRequests/mokaDeleteCard.js";
import mokaGetCustomersCardsList from "../../utils/mokaPosRequests/mokaRegisterCardRequests/mokaCardRequests/mokaGetCustomersCardsList.js";

const deleteRegisteredCardController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
        const cardToken = req.params.cardToken

        const cardList = await mokaGetCustomersCardsList( userId );
        if(
            !cardList 
            || cardList.error 
            || cardList.serverStatus === -1
        ){
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                      );
        }

        const { cardData } = cardList.data;
        const cardCount = parseInt( cardData.CardListCount );
        const cards = cardData.CardList;

        const isCardBelongsToUser = cards.find( card => card.CardToken === cardToken );
        if( !isCardBelongsToUser ){
            return res.status( 401 )
                      .json(
                        {
                            error: true,
                            message: "UnAuthorized"
                        }
                      );
        }

        const deleteCardRequest = await mokaDeleteCard( cardToken );
        if(
            !deleteCardRequest 
            || deleteCardRequest.error 
            || deleteCardRequest.serverStatus === -1
        ){
            return res.status( 500 )
                      .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                      );
        }

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Card Removed Succesfully"
                    }
                  );

    }catch( err ){
        console.log( "ERROR: deleteRegisteredCardController - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                  );
    }
}

export default deleteRegisteredCardController;