import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const updateSubsellerXmlModel = (
    caregiverGuid,
    fullname,
    phoneNumber,
    iban,
    openAdress,
    email
) => {
    return `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                    <Pazaryeri_TP_AltUyeIsyeri_Guncelleme xmlns="https://turkpos.com.tr/">
                        <G>
                            <CLIENT_CODE>${ env.PARAM_CLIENT_CODE }</CLIENT_CODE>
                            <CLIENT_USERNAME>${ env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>
                            <CLIENT_PASSWORD>${ env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>
                        </G> 
                        <GUID_AltUyeIsyeri>${ caregiverGuid }</GUID_AltUyeIsyeri>`
                        + ( fullname.replace(/\s+/g, '') !== ' ' ) 
                                ? `<Ad_Soyad>${ fullname }</Ad_Soyad>` 
                                : "" 
                        + ( phoneNumber.replace(/\s+/g, '') !== ' ' ) 
                                ? `<GSM_No>${ phoneNumber }</GSM_No>` 
                                : ""
                        + ( iban.replace(/\s+/g, '') !== ' ' ) 
                                ? `<IBAN_No>${ iban }</IBAN_No>` 
                                : ""
                        + ( openAdress.replace(/\s+/g, '') !== ' ' ) 
                                ? `<Adres>${ openAdress }</Adres>` 
                                : ""
                        + ( email.replace(/\s+/g, '') !== ' ' ) 
                                ? `<EPosta>${ email }</EPosta>` 
                                : ""
                    + `</Pazaryeri_TP_AltUyeIsyeri_Guncelleme>
                </soap:Body>
            </soap:Envelope>`;
}

export default updateSubsellerXmlModel;