#ifndef AUTHTOKEN_H
#define AUTHTOKEN_H

#include <jwt-cpp/jwt.h>
#include <string>

// Token doğrulama işlemi
jwt::decoded_jwt<jwt::traits::kazuho_picojson> verifyRefreshToken(const std::string& token);

#endif // AUTHTOKEN_H
