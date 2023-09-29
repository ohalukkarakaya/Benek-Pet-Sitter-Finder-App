const numberToTurkishHelper = ( number ) => {
    const birler = ["", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz"];
    const onlar = ["", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan"];
    const birimler = ["", "Bin", "Milyon", "Milyar", "Trilyon", "Katrilyon", "Kentilyon", "Seksilyon", "Septilyon", "Oktilyon", "Nonilyon", "Desilyon"];

    const isDotIncluded = number.toString().includes(".");
    const isComaIncluded = number.toString().includes(",");
    const valueToSplit = isDotIncluded ? 
                            "." 
                            : isComaIncluded 
                                ? ","
                                : undefined
    // Küsürat kısmını ayır
    const [tamKisim, kesirKisim] = number.toString().split( valueToSplit );

    const sayiStr = number.toString();
    const tamKisimSayiUzunluk = tamKisim.length;
    const kesirKisimSayiUzunluk = kesirKisim ? kesirKisim.length : 0;

    if (number === 0) {
        return "Sıfır";
    }

    let sonuc = "";

    let çevrilenKesirKisim = "";
    let cevrilenSayi = "";

    let loopCount = 0;
    if( kesirKisim ){
        loopCount = 1;
    }

    for( let indx = 0; indx <= loopCount; indx ++ ){

        let sayiUzunluk = indx === 0 ? tamKisimSayiUzunluk : kesirKisimSayiUzunluk;

        let valueToInsert = "";

        for( let i = 0; i < sayiUzunluk; i += 3 ){
            const blok = parseInt( sayiStr.substr( i, 3 ), 10 );
    
            if (blok === 0) continue;
    
            const yuzler = Math.floor( blok / 100 );
            const onlarBasamagi = Math.floor( ( blok % 100 ) / 10 );
            const birlerBasamagi = blok % 10;
    
            if( yuzler > 0 ){
                valueToInsert += birler[ yuzler ] + " Yüz";
            }
    
            if( onlarBasamagi > 0 ){
                valueToInsert += onlar[ onlarBasamagi ];
            }
    
            if( birlerBasamagi > 0 ){
                valueToInsert += birler[ birlerBasamagi ];
            }
    
            if( i < sayiUzunluk - 3 ){
                valueToInsert += " " + birimler[ 
                                            Math.floor( ( sayiUzunluk - i - 1 ) / 3 ) 
                                       ] + " ";
            }
        }

        if( indx === 0 ){
            cevrilenSayi = valueToInsert + " Türk Lirası";
        }else{
            çevrilenKesirKisim = valueToInsert + " Kuruş";
        }
    }

    sonuc = çevrilenKesirKisim !== ""
            && çevrilenKesirKisim !== undefined
                ? cevrilenSayi + " " + çevrilenKesirKisim
                : cevrilenSayi;

    return sonuc;
}

export default numberToTurkishHelper;