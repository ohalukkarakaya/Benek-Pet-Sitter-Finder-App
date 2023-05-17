import Log from "../../models/Log.js";

// Log kaydını MongoDB'ye kaydetme fonksiyonu
const saveLogHelper = ( logData ) => {
    const log = new Log( logData );
    log.save(
        ( err ) => {
            if ( err ) {
                console.error( 'Log kaydı kaydedilirken bir hata oluştu:', err );
            }
        }
    );
}

export default saveLogHelper;