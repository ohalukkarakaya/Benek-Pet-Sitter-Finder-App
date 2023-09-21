const sendEmailHelper = (
    type,
    password,
    careGiverName,
    petName,
    careGiverPhone,
    careGiverEmail,
    emergencyMessage
) => {
    let title;
    let message;
    let warning;
    let messageComponent;
    let style;

    if( type === "otp" ){
        title = "👋 &nbsp; Benek'e Hoş Geldiniz"
        message = "Lütfen aşağıdaki altı haneli kodu BenekApp'te ilgili alana girerek <br> Eposta adresinizi onaylayıp, üyeliğinizi tamamlayın.";
        warning = "Bu kodun <b>1 saat içerisinde süresi dolar.</b> Benek'te bir hesap oluşturmaya çalışmadıysanız, bu epostayı görmezden gelebilirsiniz.";
        style = `style="max-width: 320px; min-width: 500px; display: table-cell; vertical-align: top;"`
        messageComponent = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="font-family: arial, helvetica, sans-serif;">
                                <tbody>
                                <tr>
                                    <td align="left" style="word-break: break-word; padding: 10px 32px; font-family: arial, helvetica, sans-serif;">
                                    <div>
                                        <div style=" text-align: center; background-color: #D54D3A !important; padding: 50px; font-size: 20px; font-family: monaco; border-radius: 16px;">
                                        <strong style="color: rgb(255, 255, 255) !important; letter-spacing: 10px !important;">${ password }</strong>
                                        </div>
                                    </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>`;
    }else if( type === "tempPassWord" ){
        title = "Geçici Şifre"
        message = "Lütfen aşağıdaki şifreyi yeni Benek şifreniz olarak kullanın. "; 
        warning = "Şiddetle, uygulama üzerinden <b>mümkün olan ilk fırsatta yeni bir şifre oluşturmanızı tavsiye ederiz.</b> ";
        style = `style="max-width: 320px; min-width: 500px; display: table-cell; vertical-align: top;"`;
        messageComponent = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="font-family: arial, helvetica, sans-serif;">
                                <tbody>
                                <tr>
                                    <td align="left" style="word-break: break-word; padding: 10px 32px; font-family: arial, helvetica, sans-serif;">
                                    <div>
                                        <div style=" text-align: center; background-color: #D54D3A !important; padding: 50px; font-size: 20px; font-family: monaco; border-radius: 16px;">
                                        <strong style="color: rgb(255, 255, 255) !important; letter-spacing: 10px !important;">${ password }</strong>
                                        </div>
                                    </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>`;
    }else if( type === "emergency" ){
        title = "Acil Durum"
        message = `Bu mesaj, bakıcınız: ${careGiverName} tarafından, evcil hayvanınız: ${petName} hakkında gönderilmiş bir acil durum mesajıdır.`
        warning = `<b>Lütfen belirtilen iletişim bilgilerinden, derhal bakıcınızla iletişime geçiniz. TelNo: ${careGiverPhone}, Email: ${careGiverEmail}</b>`;
        style = `style="max-width: 320px; min-width: 500px; display: table-cell; vertical-align: top;"`;
        messageComponent = `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="font-family: arial, helvetica, sans-serif;">
                                <tbody>
                                <tr>
                                    <td align="left" style="word-break: break-word; padding: 10px 32px; font-family: arial, helvetica, sans-serif;">
                                    <div>
                                        <div style=" text-align: center; background-color: #D54D3A !important; padding: 50px; font-size: 20px; font-family: monaco; border-radius: 16px;">
                                        <strong style="color: rgb(255, 255, 255) !important;">${ emergencyMessage }</strong>
                                        </div>
                                    </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>`;
    }

    return `
            <div style="padding-top: 10%">
            <div>
            <div>
                <div>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="font-family: arial, helvetica, sans-serif;">
                    <tbody>
                    <tr>
                        <td align="left" style="padding: 20px; font-family: arial, helvetica, sans-serif;">
                        <div style="line-height: 140%; text-align: left; overflow-wrap: break-word;">
                            <p style="font-size: 14px; line-height: 140%; text-align: center;">
                            <span>
                                <strong>
                                <span style="font-size: 24px; line-height: 33.6px;">${ title }</span>
                                </strong>
                            </span>
                            </p>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table width="100%" style="font-family: arial, helvetica, sans-serif;">
                    <tbody>
                    <tr>
                        <td align="left" style="padding: 13px 30px 30px; font-family: arial, helvetica, sans-serif;">
                        <div style="line-height: 140%; text-align: left; overflow-wrap: break-word;">
                            <p style="font-size: 14px; line-height: 140%; text-align: center;">
                            <span style="font-size: 16px; line-height: 22.4px; font-family: Source Sans Pro, sans-serif;">${ message }</span>
                            </p>
                        </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </div>
        <div class="x_u-row-container" style="padding: 0px; background-color: transparent !important;">
            <div class="x_u-row" style="margin: 0px auto; min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-break: break-word; background-color: transparent !important;">
            <div style="border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent !important;">
                <div class="x_u-col x_u-col-100" ${ style }>
                <div style="height: 100%; border-radius: 0px; width: 100% !important;">
                    <div style="height: 100%; padding: 0px; border-width: 0px; border-style: solid; border-color: transparent; border-radius: 0px;">
                    ${ messageComponent }
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="font-family: arial, helvetica, sans-serif; color: rgb(255, 255, 255) !important;">
                        <tbody style="color: rgb(255, 255, 255) !important;">
                        <tr style="color: rgb(255, 255, 255) !important;">
                            <td align="left" style="word-break: break-word; padding: 25px 48px; font-family: arial, helvetica, sans-serif; color: rgb(255, 255, 255) !important;">
                            <div style="color: rgb(255, 255, 255) !important; line-height: 140%; text-align: left; overflow-wrap: break-word;">
                                <p style="font-size:14px; line-height:140%; text-align:center">
                                <span style="font-size: 14px; line-height: 19.6px; color: rgb(173, 173, 173) !important; font-family: Source Sans Pro, sans-serif;" data-ogsc="rgb(103, 103, 103)">${ warning }</span>
                                </p>
                            </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    `;
}

export default sendEmailHelper;