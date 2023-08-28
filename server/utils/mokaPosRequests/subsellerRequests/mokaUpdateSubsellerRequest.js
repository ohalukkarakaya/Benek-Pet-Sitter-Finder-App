const mokaUpdateSubsellerRequest = async (
    mokaSubSellerCode,
    firstName,
    middleName,
    lastName,
    email,
    nationalIdNo,
    phoneNumber,
    openAdress,
    iban
) => {
    return new Promise(
        async (
            resolve,
            reject
        ) => {
            const mokaCredentials = mokaCredentialsHelper();
            const name = [
                firstName,
                middleName,
                lastName,
            ];

            const fullName = name.join(" ")
                                 .replaceAll("undefined", "")
                                 .replaceAll("  ", " ");

            const nationalIdNoLength = 10;
            const paddedNationalIdNo = nationalIdNo.padStart(
                                                        nationalIdNoLength, 
                                                        '0'
                                                    ).replace(
                                                        /[^\d]/g,
                                                        '0'
                                                    ).toUpperCase();
                                                    
            const ibanFinal = iban.toUpperCase()
                                  .replaceAll( " ", "" )
                                  .replaceAll( "TR", "" );

            let openAdressMaxLength = 50;
            const openAdressFinal = truncateString( openAdress, openAdressMaxLength );

            const phoneNumberFinal = phoneNumber.replaceAll( "+90", "" );

            let dealerRequest;

            dealerRequest.SubDealerCode = mokaSubSellerCode;

            if(
            paddedNationalIdNo !== null
            || paddedNationalIdNo !== undefined
            || paddedNationalIdNo !== ""
            || paddedNationalIdNo !== " "
            ){
                dealerRequest.TRIdentityNumber = paddedNationalIdNo;
            }
            
            if(
                fullName !== null
                || fullName !== undefined
                || fullName !== ""
                || fullName !== " "
            ){
                dealerRequest.IndividualName = fullName;
                dealerRequest.IBanFullName = fullName;
            }

            if(
                email !== null
                || email !== undefined
                || email !== ""
                || email !== " "
            ){
                dealerRequest.Email = email;
            }

            if(
                phoneNumberFinal !== null
                || phoneNumberFinal !== undefined
                || phoneNumberFinal !== ""
                || phoneNumberFinal !== " "
            ){   
                dealerRequest.PhoneNumber = phoneNumberFinal;
            }

            if(
                ibanFinal !== null
                || ibanFinal !== undefined
                || ibanFinal !== ""
                || ibanFinal !== " "
            ){   
                dealerRequest.IBan = ibanFinal;
            }

            if(
                openAdressFinal !== null
                || openAdressFinal !== undefined
                || openAdressFinal !== ""
                || openAdressFinal !== " "
            ){   
                dealerRequest.Address = openAdressFinal;
            }
            
            const data = {
                "DealerAuthentication": mokaCredentials,
                "DealerRequest": dealerRequest

            }

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${ env.MOKA_TEST_URL_BASE }/Dealer/UpdateDealer`,
                headers: { 'Content-Type': 'application/json' },
                data: data
            };

            try{
                let response
                const responseData = await axios.request( config );

                const returnedResponse = JSON.stringify( responseData.data );
                if(
                    !responseData
                    || responseData.status !== 200
                    || returnedResponse.ResultCode !== "Success"
                ){
                    reject(
                        {
                            error: true,
                            serverStatus: -1,
                            message: `Api error: ${ responseData.status }, Server Message: ${ returnedResponse.ResultCode }`
                        }
                    );
                }

                let sonuc = returnedResponse.ResultCode === "Success"
                                ? 1
                                : -1;

                let sonucStr = returnedResponse.ResultCode;
                let guidAltUyeIsyeriData = returnedResponse.Data;

                response = {
                    error: false,
                    data: {
                        sonuc: sonuc,
                        sonucStr: sonucStr,
                        guidAltUyeIsyeriData: guidAltUyeIsyeriData
                    }
                }
                
                resolve( response );
            }catch( err ){
                console.log( "ERROR: mokaUpdateSubsellerRequest - ", err );
                reject(
                    {
                        error: true,
                        serverStatus: -1,
                        message: "Internal Server Error",
                    }
                );
            }
        }
    );
}

export default mokaUpdateSubsellerRequest;