#pragma once

#include <drogon/HttpController.h>

#include "exceptions/MongoSchemaException/MongoSchemaException.h"
#include "exceptions/MongoValidationException/MongoValidationException.h"
#include "exceptions/NotFoundException/NotFoundException.h"

using namespace drogon;

namespace api
{
    namespace v1
    {
        class authToken : public drogon::HttpController<authToken>
        {
          public:
            METHOD_LIST_BEGIN
            METHOD_ADD(authToken::getNewAccessToken, "/getNewAccessToken", Post);
            METHOD_ADD(authToken::logout, "/logout", Delete);
            METHOD_LIST_END

            void getNewAccessToken(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback);
            void logout(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback);
        };
    }
}