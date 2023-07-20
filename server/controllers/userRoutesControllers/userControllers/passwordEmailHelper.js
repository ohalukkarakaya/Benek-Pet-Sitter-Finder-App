const passwordEmailHelper = (
    type,
    password
) => {
    let title;
    let message;
    let warning;

    if( type === "otp" ){
        title = "👋 &nbsp; Welcome To The BenekApp"
        message = "Please enter 6 digit code below into The BenekApp <br> to verify your email address and complete the signup.";
        warning = "This code <b>expires in 1 hour.</b> If you didn't try to create an account on BenekApp, you can ignore this email.";
    }else if( type === "tempPassWord" ){
        title = "Temporary Password"
        message = "Please use password below as your new BenekApp password. "; 
        warning = "We forcely reccomend you to <b>set a new password as soon as possible</b> in the app";
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
                <div class="x_u-col x_u-col-100" style="max-width: 320px; min-width: 500px; display: table-cell; vertical-align: top;">
                <div style="height: 100%; border-radius: 0px; width: 100% !important;">
                    <div style="height: 100%; padding: 0px; border-width: 0px; border-style: solid; border-color: transparent; border-radius: 0px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0" style="font-family: arial, helvetica, sans-serif;">
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
                    </table>
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

export default passwordEmailHelper;