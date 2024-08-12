#ifndef BENEK_SERVER_JWTCREATER_H
#define BENEK_SERVER_JWTCREATER_H

#include <jwt-cpp/jwt.h>
#include <string>

std::string createAccessToken(const std::string& userId, const std::string& roles);

#endif //BENEK_SERVER_JWTCREATER_H
