import dotenv from "dotenv";

dotenv.config();

const payXmlModel = (
    fullname,
    cardNo,
    cardExpiryMonth,
    cardExpiryYear,
    cvv,
    gsmNo,
    errorUrl,
    successUrl,
    siparisId,
    siparisAciklama,
    paymentType,
    refUrl,
    price,
    subsellersShare,
    hashValue
) => {
    return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>\n
            <TP_WMD_UCD xmlns="https://turkpos.com.tr/">\n
                <G>\n
                    <CLIENT_CODE>${ process.env.PARAM_CLIENT_CODE }</CLIENT_CODE>\n
                    <CLIENT_USERNAME>${ process.env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>\n
                    <CLIENT_PASSWORD>${ process.env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>\n
                </G>\n
                <GUID>${ process.env.PARAM_GUID }</GUID>\n
                <KK_Sahibi>${ fullname }</KK_Sahibi>\n
                <KK_No>${ cardNo }</KK_No>\n
                <KK_SK_Ay>${ cardExpiryMonth }</KK_SK_Ay>\n
                <KK_SK_Yil>${ cardExpiryYear }</KK_SK_Yil>\n
                <CVV>${ cvv }</CVV>
                <KK_Sahibi_GSM>${ gsmNo }</KK_Sahibi_GSM>\n
                <Hata_URL>${ errorUrl }</Hata_URL>\n
                <Basarili_URL>${ successUrl }</Basarili_URL>\n
                <Siparis_ID>${ siparisId }</Siparis_ID>\n
                <Siparis_Aciklama>${ siparisAciklama }</Siparis_Aciklama>\n
                <Taksit>1</Taksit>\n
                <Islem_Tutar>${ subsellersShare }</Islem_Tutar>\n
                <Toplam_Tutar>${ price }</Toplam_Tutar>\n
                <Islem_Hash>${ hashValue }</Islem_Hash>\n
                <Islem_Guvenlik_Tip>${ paymentType }</Islem_Guvenlik_Tip>\n
                <IPAdr>127.0.0.1</IPAdr>\n
                <Ref_URL>${ refUrl }</Ref_URL>\n
            </TP_WMD_UCD>\n
        </soap:Body>\n
    </soap:Envelope>`;
}

export default payXmlModel;