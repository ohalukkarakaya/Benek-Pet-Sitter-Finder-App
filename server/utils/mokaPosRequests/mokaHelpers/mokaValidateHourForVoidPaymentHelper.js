const mokaValidateHourForVoidPaymentHelper = ( dateTime ) => {
    const createdAt = new Date( dateTime );
    const currentHour = new Date().getUTCHours();

    const targetHour = 22; // 22:00

    // Türkiye saatine çevirme
    const turkishCreatedAt = new Date(createdAt.getTime() + (3 * 60 * 60 * 1000)); // 3 saat ekleme (UTC+3)
    
    if(
        (
            turkishCreatedAt.getHours() < targetHour 
            && currentDateTime.getHours() < targetHour
        ) 
        || (
            turkishCreatedAt.getHours() >= targetHour 
            && turkishCreatedAt.getDate() === currentDateTime.getDate() 
            && currentDateTime.getHours() >= targetHour
        )
    ){
        return true;
    }
    
    return false;
}

export default mokaValidateHourForVoidPaymentHelper;