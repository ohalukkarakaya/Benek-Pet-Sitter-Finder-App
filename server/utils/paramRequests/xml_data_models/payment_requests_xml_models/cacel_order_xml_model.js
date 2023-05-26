import dotenv from "dotenv";

dotenv.config();

const cancelOrderXmlModel = (
    price,
    orderGuid,
    orderId,
    situation
) => {
    return `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n
        <soap:Body>\n
            <Pazaryeri_TP_Iptal_Iade xmlns="https://turkpos.com.tr/">\n
                <G>\n
                    <CLIENT_CODE>${ process.env.PARAM_CLIENT_CODE }</CLIENT_CODE>\n
                    <CLIENT_USERNAME>${ process.env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>\n
                    <CLIENT_PASSWORD>${ process.env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>\n
                </G>\n
                <PYSiparis_GUID>${ orderGuid }</PYSiparis_GUID>\n
                <GUID>${ process.env.PARAM_GUID }</GUID>\n
                <Durum>${ situation }</Durum>\n
                <Siparis_ID>${ orderId }</Siparis_ID>\n
                <Tutar>${ price }</Tutar>\n
            <Pazaryeri_TP_Iptal_Iade>\n
        </soap:Body>\n
    </soap:Envelope>`;
}

export default cancelOrderXmlModel;