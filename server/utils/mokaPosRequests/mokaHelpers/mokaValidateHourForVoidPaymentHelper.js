const mokaValidateHourForVoidPaymentHelper = ( dateTime ) => {
    // Şu anki tarihi alın
    const now = new Date();

    // Türkiye saat dilimine ayarlayın (GMT+3)
    now.setHours(now.getHours() + 3);

    const createdAt = new Date( dateTime );

    // createdAt'i Türkiye saatine çevirin (GMT+3)
    createdAt.setUTCHours(createdAt.getUTCHours() + 3);

    // createdAt ve şu anki tarihi aynı gün mü kontrol edin
    const isSameDay = createdAt.toDateString() === now.toDateString();

    const targetHour = 22; // 22:00

    // Eğer aynı gün ise createdAt saatini kontrol edin
    if ( isSameDay && createdAt.getHours() < targetHour ){
        return true;
    }
    
    return false;
}

export default mokaValidateHourForVoidPaymentHelper;