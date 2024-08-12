#ifndef USERTOKENSEHEMA_H
#define USERTOKENSEHEMA_H

#include "models/MongoSchema/MongoSchema.h"
#include <bsoncxx/oid.hpp>
#include <string>
#include <optional>

class UserTokenSchema : public MongoSchema {
protected:
    void initializeSchema(bsoncxx::document::view document) override;
    bool validation() const override;

public:
    UserTokenSchema() : MongoSchema("usertokens") {
        this->expires = 30 * 86400;
    }

    bsoncxx::oid _id;
    bsoncxx::oid userId;
    bool isCareGiver = false;
    bool isEmailVerified = false;
    bool isPhoneVerified = false;
    std::string token;
    int created_at_option = 1; // on | off
    std::chrono::system_clock::time_point createdAt;

    std::string to_json() const;

};

#endif // USERTOKENSEHEMA_H
