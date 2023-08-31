import mokaGetCustomersCardsList from "../mokaRegisterCardRequests/mokaCardRequests/mokaGetCustomersCardsList.js";

const mokaCheckifCardAlreadyRegisteredHelper = async ( userId, cardNo ) => {

    const cardList = await mokaGetCustomersCardsList( userId );

    if(
        !cardList 
        || cardList.error 
        || cardList.serverStatus === -1
    ){
        return {
            error: true,
            serverStatus: -1,
            message: "Internal Server Error",
        };
    }

    const { cardData } = cardList.data;
    const cardCount = parseInt( cardData.CardListCount );
    const cards = cardData.CardList;

    const firstSixDigit = cardNo.substring( 0, 6 );
    const lastFourDigit = cardNo.substring( cardNo.length - 4 );

    if ( cardCount <= 0 ){
        return {
            error: false,
            isCardAlreadyRegistered: false,
        };
    }

    const areThereSameCard = cards.some(
                                        cardObject =>
                                            cardObject.CardNumberFirstSix === firstSixDigit 
                                            && cardObject.CardNumberLastFour === lastFourDigit
                                   );

    return {
        error: false,
        isCardAlreadyRegistered: areThereSameCard,
    };
};

export default mokaCheckifCardAlreadyRegisteredHelper;