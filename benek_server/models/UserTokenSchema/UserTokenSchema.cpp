#include "UserTokenSchema.h"
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/oid.hpp>


void UserTokenSchema::initializeSchema(bsoncxx::document::view document) {
    if (document.find("_id") != document.end() && document["_id"].type() == bsoncxx::type::k_oid) {
        this->_id = document["_id"].get_oid().value;
    }

    if (document.find("userId") != document.end() && document["userId"].type() == bsoncxx::type::k_oid) {
        this->userId = document["userId"].get_oid().value;
    }

    if (document.find("isCareGiver") != document.end() && document["isCareGiver"].type() == bsoncxx::type::k_bool) {
        this->isCareGiver = document["isCareGiver"].get_bool().value;
    }

    if (document.find("isEmailVerified") != document.end() && document["isEmailVerified"].type() == bsoncxx::type::k_bool) {
        this->isEmailVerified = document["isEmailVerified"].get_bool().value;
    }

    if (document.find("isPhoneVerified") != document.end() && document["isPhoneVerified"].type() == bsoncxx::type::k_bool) {
        this->isPhoneVerified = document["isPhoneVerified"].get_bool().value;
    }

    if (document.find("token") != document.end() && document["token"].type() == bsoncxx::type::k_utf8) {
        this->token = document["token"].get_string().value.to_string();
    }

    if (document.find("createdAt") != document.end() && document["createdAt"].type() == bsoncxx::type::k_date) {
        auto date_value = document["createdAt"].get_date().value;
        auto time_point = std::chrono::system_clock::from_time_t(date_value.count() / 1000);
    }
}

bool UserTokenSchema::validation() const {
    return (userId != bsoncxx::oid{}) && !token.empty();
}

// JSON formatında döküman döndür
std::string UserTokenSchema::to_json() const {
    bsoncxx::builder::basic::document document{};

    // `createdAt` için `time_t` değeri oluştur
    auto createdAtTime = std::chrono::system_clock::to_time_t(createdAt);

    // `bsoncxx::types::b_date` oluştur
    bsoncxx::types::b_date date{std::chrono::system_clock::from_time_t(createdAtTime)};

    document.append(
        bsoncxx::builder::basic::kvp("userId", userId),
        bsoncxx::builder::basic::kvp("isCareGiver", isCareGiver),
        bsoncxx::builder::basic::kvp("isEmailVerified", isEmailVerified),
        bsoncxx::builder::basic::kvp("isPhoneVerified", isPhoneVerified),
        bsoncxx::builder::basic::kvp("token", token),
        bsoncxx::builder::basic::kvp("createdAt", date)
    );

    return bsoncxx::to_json(document.view());
}