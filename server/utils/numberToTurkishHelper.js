const numberToTurkishHelper = ( number ) => {
    const birler = [ "", "Bir", "İki", "Üç", "Dört", "Beş", "Altı", "Yedi", "Sekiz", "Dokuz" ];
    const onlar = [ "", "On", "Yirmi", "Otuz", "Kırk", "Elli", "Altmış", "Yetmiş", "Seksen", "Doksan" ];
    const birimler = [ "", "Bin", "Milyon", "Milyar", "Trilyon", "Katrilyon", "Kentilyon", "Seksilyon", "Septilyon", "Oktilyon", "Nonilyon", "Desilyon" ];

    const isDotIncluded = number.toString().includes(".");
    const isComaIncluded = number.toString().includes(",");
    const valueToSplit = isDotIncluded ? 
                            "." 
                            : isComaIncluded 
                                ? ","
                                : undefined
    // Küsürat kısmını ayır
    let [ tamKisim, kesirKisim ] = number.toString().split( valueToSplit );

    if( number === 0 ){
        return "Sıfır Türk Lirası";
    }

    let sonuc = "";

    let cevrilenKesirKisim = "";
    let cevrilenSayi = "";

    let loopCount = 0;
    if( kesirKisim ){
        loopCount = 1;
    }

    let isFractionStartsWithZero = kesirKisim.startsWith( '0' );
    
    //kesir kısım sıfır ile başlıyorsa başındaki sıfırı sil, sıfır ile başlamıyorsa sonuna bir sıfır ekle
    if( isFractionStartsWithZero ){
        kesirKisim = kesirKisim.replaceAll( '0', '' );
    }else if( !isFractionStartsWithZero ){
        kesirKisim = kesirKisim + '0';
    }

    for( let indx = 0; indx <= loopCount; indx ++ ){
        let number = indx === 0 ? tamKisim : kesirKisim;
        let valueToInsert = "";

        let i = 0;
        while( number > 0 ){
            const blok = number % 1000;
            if( blok > 0 ){
                let result = "";
                
                const yuzler = Math.floor( blok / 100 );
                const onlarBasamagi = Math.floor( ( blok % 100 ) / 10 );
                const birlerBasamagi = blok % 10;

                if( yuzler > 0 ){
                    result += birler[ yuzler ] + " Yüz ";
                }

                if( onlarBasamagi > 0 ){
                    result += onlar[ onlarBasamagi ] + " ";
                }

                if( birlerBasamagi > 0 ){
                    result += birler[ birlerBasamagi ] + " ";
                }

                const blokWords = result.trim();
                if( valueToInsert ){
                    valueToInsert = blokWords + " " + birimler[ i ] + valueToInsert;
                }else{
                    valueToInsert = blokWords + " " + birimler[ i ];
                }
            }
            number = Math.floor( number / 1000 );
            i++;
        }

        if( indx === 0 ){
            cevrilenSayi = valueToInsert.trim() + " Türk Lirası";
        }else{
            cevrilenKesirKisim = valueToInsert.trim() + " Kuruş";
        }
    }

    sonuc = cevrilenKesirKisim !== ""
            && cevrilenKesirKisim !== undefined
                ? cevrilenSayi + " " + cevrilenKesirKisim
                : cevrilenSayi;

    return sonuc;
}

export default numberToTurkishHelper;