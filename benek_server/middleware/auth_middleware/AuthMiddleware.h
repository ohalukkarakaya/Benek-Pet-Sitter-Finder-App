#ifndef AUTHMIDDLEWARE_H

#define AUTHMIDDLEWARE_H

#include <drogon/HttpMiddleware.h>
#include <jwt-cpp/jwt.h>
#include <iostream>

class AuthMiddleware : public drogon::HttpMiddleware<AuthMiddleware>
{
public:
    AuthMiddleware(){};  // constructor

    void invoke(const drogon::HttpRequestPtr &req,
                drogon::MiddlewareNextCallback &&nextCb,
                drogon::MiddlewareCallback &&mcb) override;
};

#endif // AUTHMIDDLEWARE_H
