const mokaValidateHourForVoidPaymentHelper = ( dateTime ) => {
    const createdAt = new Date( dateTime );
    const currentHour = new Date().getUTCHours();

    const targetHour = 22; // 22:00
    
    if (
        (
            createdAt.getUTCHours() < targetHour 
            && currentHour < targetHour
        ) 
        || (
            createdAt.getUTCHours() >= targetHour 
            && createdAt.getUTCDate() === new Date().getUTCDate() 
            && currentHour >= targetHour
        )
    ){
        return true;
    }
    
    return false;
}

export default mokaValidateHourForVoidPaymentHelper;