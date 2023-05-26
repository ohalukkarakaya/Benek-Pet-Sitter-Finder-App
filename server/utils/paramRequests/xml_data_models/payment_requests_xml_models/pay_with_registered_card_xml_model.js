import dotenv from "dotenv";

dotenv.config();

const payWithRegisteredCardXmlModel = (
    kkGuid,
    is3d,
    cvv,
    gsmNo,
    errorUrl,
    successUrl,
    siparisId,
    siparisAciklama,
    price,
    subsellersShare,
    paymentType,
    refUrl
) => {
    return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>\n
            <KS_Tahsilat xmlns="https://turkpara.com.tr/">\n
                <G>\n
                    <CLIENT_CODE>${ process.env.PARAM_CLIENT_CODE }</CLIENT_CODE>\n
                    <CLIENT_USERNAME>${ process.env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>\n
                    <CLIENT_PASSWORD>${ process.env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>\n
                </G>\n
                <GUID>${ process.env.PARAM_GUID }</GUID>\n
                <KS_GUID>${ kkGuid }</KS_GUID>\n`
                + is3d ? `<CVV>${ cvv }</CVV>` : ""
                + `<KK_Sahibi_GSM>${ gsmNo }</KK_Sahibi_GSM>\n
                <Hata_URL>${ errorUrl }</Hata_URL>\n
                <Basarili_URL>${ successUrl }</Basarili_URL>\n
                <Siparis_ID>${ siparisId }</Siparis_ID>\n
                <Siparis_Aciklama>${ siparisAciklama }</Siparis_Aciklama>\n
                <Taksit>1</Taksit>\n
                <Islem_Tutar>${ price }</Islem_Tutar>\n
                <Toplam_Tutar>${ subsellersShare }</Toplam_Tutar>\n
                <Islem_Guvenlik_Tip>${ paymentType }</Islem_Guvenlik_Tip>\n
                <IPAdr>127.0.0.1</IPAdr>\n
                <Ref_URL>${ refUrl }</Ref_URL>\n
                <KK_Islem_ID></KK_Islem_ID>\n
            </KS_Tahsilat>\n
        </soap:Body>\n
    </soap:Envelope>`;
}

export default payWithRegisteredCardXmlModel;