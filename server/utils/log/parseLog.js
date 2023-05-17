import UserToken from '../../models/UserToken.js';

// Log kaydını ayrıştırma fonksiyonu
const parseLogData = async ( log ) => {
    const logParts = log.split(' | ');
    let userId = logParts[0];
    const logData = logParts[1];

    if( 
        userId.includes( "RefreshToken:" )
    ){
        const refreshToken = userId.replaceAll( "RefreshToken: ", "" );
        const userToken = await UserToken.findOne( { token: refreshToken } );
        console.log( refreshToken );
        if( userToken ){
            userId = userToken.userId.toString();
        }else{
            userId = "*";
        }
    }
  
    const logDataParts = logData.split(' - ');

    const methodUrl = logDataParts[0].split(' ');
    const method = methodUrl[0];
    const url = methodUrl[1];
    
    const status = logDataParts[1];
    const contentLength = logDataParts[2];
    const responseTime = logDataParts[3].split(' ')[0];
    const date = logDataParts[4];
  
    return {
      userId,
      method,
      url,
      status,
      contentLength,
      responseTime,
      date,
    };
}

export default parseLogData;