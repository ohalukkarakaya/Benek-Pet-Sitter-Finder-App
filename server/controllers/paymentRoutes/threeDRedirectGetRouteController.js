const threeDRedirectGetRouteController = async ( req, res ) => {
    const isSuccess = req.query.isSuccess === 'true';
    const alreadyPaid = req.query.alreadyPaid === 'true';
    const ticketId = req.query.ticketId;
    
    const alreadyPaidMessage = "işlem zaten gerçekleşti,"

    if( isSuccess ){
        return res.status( 200 )
                  .json(
                    {
                        error: false,
                        message: "İşlem Başarılı, Yönlendiriliyorsunuz",
                        ticketId: ticketId
                    }
                  );
    }else{
        return res.status( 500 )
                  .json(
                        {
                            error: true,
                            message: `İşlem ${ alreadyPaid ? alreadyPaidMessage : "Başarısız" }, Yönlendiriliyorsunuz`,
                            ticketId: null
                        }
                  );
    }
}

export default threeDRedirectGetRouteController;