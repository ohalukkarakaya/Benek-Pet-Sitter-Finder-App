#include "AuthToken.h"

#include <drogon/HttpResponse.h>
#include <drogon/HttpRequest.h>
#include <json/json.h>
#include <iostream>

#include "include/jwt_verifier/JwtVerifier.h"
#include "include/jwt_creater/JwtCreater.h"

#include "include/mongo_db_connection_pool/MongoDbConnectionPool.h"
#include "models/UserTokenSchema/UserTokenSchema.h"

using namespace api::v1;

void authToken::getNewAccessToken(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback)
{
    try
    {
        auto json = req->getJsonObject();

        if (!json || !json->isMember("refreshToken") || (*json)["refreshToken"].asString().empty())
        {
            // refreshToken eksikse 400 Bad Request yanıtını döndür
            Json::Value errorResponse;
            errorResponse["error"] = true;
            errorResponse["message"] = "missing param";

            auto resp = HttpResponse::newHttpJsonResponse(errorResponse);
            resp->setStatusCode(HttpStatusCode::k400BadRequest);
            callback(resp);
            return;
        }

        std::string sendedRefreshToken = (*json)["refreshToken"].asString();
        std::cout << sendedRefreshToken << std::endl;

        auto& pool = MongoDBConnectionPool::getInstance();
        auto client = pool.getClient();

        UserTokenSchema userToken = UserTokenSchema();
        auto filter = bsoncxx::builder::basic::make_document( bsoncxx::builder::basic::kvp("token", sendedRefreshToken) );
        userToken.find_one( filter , *client);

        auto tokenDetails = verifyRefreshToken(sendedRefreshToken);

        int roles = -1;
        std::string userId = "-";

        userId = tokenDetails.get_payload_claim("_id").as_string();
        roles = tokenDetails.get_payload_claim("roles").as_integer();


        if ( userId == "-" || roles == -1 ) {
            Json::Value errorResponse;
            errorResponse["error"] = true;
            errorResponse["message"] = "Invalid refresh token";

            auto resp = HttpResponse::newHttpJsonResponse(errorResponse);
            resp->setStatusCode(HttpStatusCode::k400BadRequest);
            callback(resp);
            return;
        }

        std::string newAccessToken = "-";
        newAccessToken = createAccessToken(userId, std::to_string(roles));

        if( newAccessToken == "-" ){
            Json::Value errorResponse;
            errorResponse["error"] = true;
            errorResponse["message"] = "Invalid refresh token";

            auto resp = HttpResponse::newHttpJsonResponse(errorResponse);
            resp->setStatusCode(HttpStatusCode::k500InternalServerError);
            callback(resp);
        }

        Json::Value ret;
        ret["error"] = false;
        ret["message"] = "Access token created successfully";
        ret["role"] = roles != -1 ? roles : 0;
        ret["accessToken"] = newAccessToken;

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);

    } catch (const std::exception& e) {
        std::cout << e.what() << std::endl;

        Json::Value ret;
        ret["error"] = true;
        ret["message"] = e.what();

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
    } catch ( const MongoSchemaException e ) {
        std::cout << e.what() << std::endl;

        Json::Value ret;
        ret["error"] = true;
        ret["message"] = e.what();

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
    } catch ( const MongoValidationException e ) {
        std::cout << e.what() << std::endl;

        Json::Value ret;
        ret["error"] = true;
        ret["message"] = e.what();

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
    } catch ( const NotFoundException e ) {
        std::cout << e.what() << std::endl;

        Json::Value ret;
        ret["error"] = true;
        ret["message"] = e.what();

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
    }
}