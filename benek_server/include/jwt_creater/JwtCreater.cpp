#include "JwtCreater.h"
#include "include/env_helper/EnvHelper.h"

std::string createAccessToken(const std::string& userId, const std::string& roles) {
    auto payload = jwt::create()
            .set_payload_claim("_id", jwt::claim(userId))
            .set_payload_claim("roles", jwt::claim(roles))
            .set_expires_at(std::chrono::system_clock::now() + std::chrono::minutes(5))
            .sign(jwt::algorithm::hs256{EnvHelper::getInstance().getFromEnv("ACCESS_TOKEN_PRIVATE_KEY")});

    return payload;
}
