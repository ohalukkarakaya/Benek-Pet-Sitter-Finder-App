import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const registerSubsellerXmlModel = ( 
    fullname,
    nationalIdNo,
    birthday,
    phoneNumber,
    iban,
    openAdress,
) => {
    return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
    <soap:Body>
        <Pazaryeri_TP_AltUyeIsyeri_Ekleme xmlns="https://turkpos.com.tr/">
            <G>
                <CLIENT_CODE>${ env.PARAM_CLIENT_CODE }</CLIENT_CODE>
                <CLIENT_USERNAME>${ env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>
                <CLIENT_PASSWORD>${ env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>
            </G> 
            <ETS_GUID>${ env.PARAM_GUID }</ETS_GUID>
            <Tip>1</Tip>
            <Ad_Soyad>${ fullname }</Ad_Soyad>
            <Unvan>Benek Bakıcı</Unvan>
            <TC_VN>${ nationalIdNo }</TC_VN>
            <Kisi_DogumTarihi>${ birthday }</Kisi_DogumTarihi>
            <GSM_No>${ phoneNumber }</GSM_No>
            <IBAN_No>${ iban }</IBAN_No>
            <IBAN_Unvan>${ fullname }</IBAN_Unvan>
            <Adres>${ openAdress }</Adres>
            <Il>${ env.MERSIS_IL_KOD }</Il>
            <Ilce>${ env.MERSIS_ILCE_KOD }</Ilce>
            <Vergi_Daire>${ env.VERGI_DAIRE_KOD }</Vergi_Daire>
        </Pazaryeri_TP_AltUyeIsyeri_Ekleme>
    </soap:Body>
    </soap:Envelope>`;
}

export default registerSubsellerXmlModel;