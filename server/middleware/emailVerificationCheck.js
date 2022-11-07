const emailVerificationCheck = (isEmailVerified) => {
    return (req, res, next) => {
        isEmailVerified.push("user");
        if(req.user.isEmailVerified.includes(...isEmailVerified)) {
            next();
        }else{
            res.status(403).json(
                {
                    error: true,
                    message: "Email Verification Is Required"
                }
            );
        }
    };
}

export default emailVerificationCheck;