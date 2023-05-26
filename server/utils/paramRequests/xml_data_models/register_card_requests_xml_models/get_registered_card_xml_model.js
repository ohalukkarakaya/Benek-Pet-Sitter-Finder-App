import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const getRegisteredCardXmlModel = ( kkGuid ) => {
    return `<?xml version="1.0" encoding="utf-8"?> 
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>\n
            <KS_Kart_Liste xmlns="https://turkpara.com.tr/">\n
                <G>\n
                    <CLIENT_CODE>${ env.PARAM_CLIENT_CODE }</CLIENT_CODE>\n
                    <CLIENT_USERNAME>${ env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>\n
                    <CLIENT_PASSWORD>${ env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>\n
                </G>\n
                <GUID>${ env.PARAM_GUID }</GUID>\n
                <KK_GUID>${ kkGuid }</KK_GUID>\n
                <KK_Islem_ID></KK_Islem_ID>\n
            </KS_Kart_Liste>\n
        </soap:Body>\n
    </soap:Envelope>`;
}

export default getRegisteredCardXmlModel;