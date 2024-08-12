#include "AuthToken.h"

#include <drogon/HttpResponse.h>
#include <json/json.h>
#include <iostream>

using namespace api::v1;

void authToken::logout(const HttpRequestPtr& req, std::function<void (const HttpResponsePtr &)> &&callback)
{
    try
    {
        Json::Value ret;
        ret["error"] = false;
        ret["message"] = "Logged Out Successfully";

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
    }
    catch (const std::exception& e)
    {
        Json::Value ret;
        ret["error"] = true;
        ret["message"] = "Internal Server Error";

        auto resp = HttpResponse::newHttpJsonResponse(ret);
        callback(resp);
    }
}