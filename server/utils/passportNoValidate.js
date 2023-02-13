const validatePassportNo = (PassNo) => {
        var expr = /^[A-PR-WY][1-9]\d\s?\d{4}[1-9]$/;

        if ( !expr.test( PassNo ) ) {
            return false;
        }

        return true;
};

export default validatePassportNo;