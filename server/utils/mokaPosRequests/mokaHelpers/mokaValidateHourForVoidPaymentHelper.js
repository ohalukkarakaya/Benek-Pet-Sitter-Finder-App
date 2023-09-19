const mokaValidateHourForVoidPaymentHelper = ( dateTime ) => {
    const createdAt = new Date( dateTime );
    const currentDateTime = new Date()
    const currentHour = currentDateTime.getUTCHours();

    const targetHour = 22; // 22:00

    // Türkiye saatine çevirme
    const turkishCreatedAt = new Date(createdAt.getTime() + (3 * 60 * 60 * 1000)); // 3 saat ekleme (UTC+3)
    
    if(
        (
            turkishCreatedAt.getHours() < targetHour 
            && currentHour < targetHour
        ) 
        || (
            turkishCreatedAt.getHours() >= targetHour 
            && turkishCreatedAt.getDate() === currentDateTime.getDate()
            && currentHour >= targetHour
        )
    ){
        return true;
    }
    
    return false;
}

export default mokaValidateHourForVoidPaymentHelper;