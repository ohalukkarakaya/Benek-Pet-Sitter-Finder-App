import mokaGetCustomersCardsList from "../../utils/mokaPosRequests/mokaRegisterCardRequests/mokaCardRequests/mokaGetCustomersCardsList.js";

const getRegisteredCardsListController = async ( req, res ) => {
    try{
        const userId = req.user._id.toString();
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

        let cardInfoList = [];
        for( let card of cards ){
            const cardInfo = {
                cardToken: card.CardToken,
                bank: card.BankName,
                cardNo: `${ card.CardNumberFirstSix }...${ card.CardNumberLastFour }`,
                exprDate: `${ card.ExpMonth }/${ card.ExpYear }`,
                cardHoldersFulName: card.CardHolderFullName,
                cardType: card.CardType,
                maxInstallmentNumber: card.MaxInstallmentNumber
            }

            cardInfoList.push( cardInfo );
        }

        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "Card List Prepared Succesfully",
                        totalCardCount: cardCount,
                        cards: cardInfoList
                    }
                  );

    }catch( err ){
        console.log( "ERROR: getRegisteredCards - ", err );
        return res.status( 500 )
                  .json(
                    {
                        error: true,
                        message: "Internal Server Error"
                    }
                  );
    }
}

export default getRegisteredCardsListController;