#include "JwtVerifier.h"
#include "include/env_helper/EnvHelper.h"

#include <stdexcept>
#include <cstdlib>

jwt::decoded_jwt<jwt::traits::kazuho_picojson> verifyRefreshToken(const std::string& token) {
    try {
        auto decoded = jwt::decode(token);

        const std::string key = EnvHelper::getInstance().getFromEnv("REFRESH_TOKEN_PRIVATE_KEY");

        // JWT'nin geçerliliğini kontrol eden kuralları belirleyebilirsiniz
        auto verifier = jwt::verify().allow_algorithm(jwt::algorithm::hs256{key});

        for (const auto& claim : decoded.get_payload_json()) {
            std::cout << "Claim adı: " << claim.first << ", Değer: " << claim.second << std::endl;
        }

        verifier.verify(decoded);

        // Token geçerliyse, detayları döndür
        return decoded;
    } catch (const jwt::error::token_verification_exception& e) {
        std::cerr << "Token doğrulama hatası: " << e.what() << std::endl;
        throw std::runtime_error("Token doğrulama hatası");
    } catch (const std::exception& e) {
        std::cerr << "Genel hata: " << e.what() << std::endl;
        throw std::runtime_error("Token doğrulama hatası");
    }
}
