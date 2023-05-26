import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const deleteSubsellerXmlModel = ( careGiverGUID ) => {
    return `<?xml version="1.0" encoding="utf-8"?> <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                <Pazaryeri_TP_AltUyeIsyeri_Silme xmlns="https://turkpos.com.tr/">
                    <G>
                        <CLIENT_CODE>${ env.PARAM_CLIENT_CODE }</CLIENT_CODE>
                        <CLIENT_USERNAME>${ env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>
                        <CLIENT_PASSWORD>${ env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>
                    </G> 
                    <GUID_AltUyeIsyeri>${ careGiverGUID }</GUID_AltUyeIsyeri>
                </Pazaryeri_TP_AltUyeIsyeri_Silme>
                </soap:Body>
            </soap:Envelope>`;
}

export default deleteSubsellerXmlModel;