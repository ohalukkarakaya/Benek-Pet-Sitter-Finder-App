const validatePassportNo = (PassNo) => {
        var expr = new RegExp("^[A-Z][0-9]{8}$")

        if ( !expr.test( PassNo ) ) {
            return false;
        }

        return true;
};

export default validatePassportNo;