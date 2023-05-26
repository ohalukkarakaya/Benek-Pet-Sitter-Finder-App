import dotenv from "dotenv";

dotenv.config();

const addDetailToOrderXmlModel = (
    price,
    subSellersShare,
    orderId,
    subSellerGuid
) => {
    return `<?xml version="1.0" encoding="utf-8"?>
                        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n
                            <soap:Body>\n
                                <Pazaryeri_TP_Siparis_Detay_Ekle xmlns="https://turkpos.com.tr/">\n
                                    <G>\n
                                        <CLIENT_CODE>${ process.env.PARAM_CLIENT_CODE }</CLIENT_CODE>\n
                                        <CLIENT_USERNAME>${ process.env.PARAM_CLIENT_USERNAME }</CLIENT_USERNAME>\n
                                        <CLIENT_PASSWORD>${ process.env.PARAM_CLIENT_PASSWORD }</CLIENT_PASSWORD>\n
                                    </G>\n
                                    <GUID>${ process.env.PARAM_GUID }</GUID>\n
                                    <Tutar_Urun>${ price }</Tutar_Urun>\n
                                    <Tutar_Odenecek>${ subSellersShare }</Tutar_Odenecek>\n
                                    <SanalPOS_Islem_ID>${ orderId }</SanalPOS_Islem_ID>\n
                                    <GUID_AltUyeIsyeri>${ subSellerGuid }</GUID_AltUyeIsyeri>\n
                                </Pazaryeri_TP_Siparis_Detay_Ekle>\n
                            </soap:Body>\n
                        </soap:Envelope>`;
}

export default addDetailToOrderXmlModel;