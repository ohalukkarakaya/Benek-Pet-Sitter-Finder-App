#include <drogon/HttpResponse.h>
#include <json/json.h>
#include "AuthMiddleware.h"

void AuthMiddleware::invoke(const drogon::HttpRequestPtr &req,
                            drogon::MiddlewareNextCallback &&nextCb,
                            drogon::MiddlewareCallback &&mcb)
{
    try
    {
        // Token'i alın
        auto token = req->getHeader("x-access-token");
        if (token.empty())
        {
            Json::Value jsonResponse;
            jsonResponse["error"] = true;
            jsonResponse["message"] = "Access Denied: No token provided";

            auto res = drogon::HttpResponse::newHttpJsonResponse(jsonResponse);
            res->setStatusCode(drogon::k403Forbidden);
            mcb(res);
            return;
        }

        // Token'i doğrulayın
        auto decoded = jwt::decode(token);
        auto verifier = jwt::verify()
                .allow_algorithm(jwt::algorithm::hs256{std::getenv("ACCESS_TOKEN_PRIVATE_KEY")})
                .with_issuer("auth0");
        verifier.verify(decoded);

        // Kullanıcıyı isteğe ekleyin
        req->attributes()->insert("user", decoded.get_payload());

        // Sonraki middleware'i çağırın
        nextCb([mcb = std::move(mcb)](const drogon::HttpResponsePtr &resp) {
            mcb(resp);
        });
    }
    catch (const jwt::error::token_verification_exception &e)
    {
        // Token süresi dolmuşsa
        Json::Value jsonResponse;
        jsonResponse["error"] = true;
        jsonResponse["message"] = "Access Denied: token expired";

        auto res = drogon::HttpResponse::newHttpJsonResponse(jsonResponse);
        res->setStatusCode(drogon::k403Forbidden);
        mcb(res);
    }
    catch (const std::exception &e)
    {
        // Diğer hatalar
        Json::Value jsonResponse;
        jsonResponse["error"] = true;
        jsonResponse["message"] = "Access Denied: Invalid token";

        auto res = drogon::HttpResponse::newHttpJsonResponse(jsonResponse);
        res->setStatusCode(drogon::k403Forbidden);
        mcb(res);
    }
}
