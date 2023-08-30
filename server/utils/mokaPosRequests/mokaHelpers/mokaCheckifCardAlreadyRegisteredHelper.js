import mokaGetCustomersCardsList from "../mokaRegisterCardRequests/mokaCardRequests/mokaGetCustomersCardsList.js";

const mokaCheckifCardAlreadyRegisteredHelper = async (
    userId,
    cardNo
) => {
    const cardList = await mokaGetCustomersCardsList( userId );
    if( 
        !cardList
        || cardList.error
        || cardList.serverStatus === -1
    ){
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Errror",
        }
    }

    const cardCount = cardList.data
                              .cardData
                              .CardListCount;

    const cards = cardList.data
                          .cardData
                          .CardList;

    const firstSixDigit = cardNo.substring( 0, 6 );
    const lastFourDigit = cardNo.substring( cardNo.length - 4 );

    if( parseInt( cardCount ) <= 0 ){
        return {
            error: false,
            isCardAlreadyRegistered: false
        }
    }

    const areThereSameCard = cards.find(
                                    cardObject =>
                                        cardObject.CardNumberFirstSix === firstSixDigit
                                        && cardObject.CardNumberLastFour === lastFourDigit
                                  );

    if( areThereSameCard ){
        return {
            error: false,
            isCardAlreadyRegistered: true
        }
    }

    return {
        error: false,
        isCardAlreadyRegistered: false
    };
}

export default mokaCheckifCardAlreadyRegisteredHelper;