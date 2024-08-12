#include "UserStarModel.h"

#include <bsoncxx/types.hpp>
#include <stdexcept>
#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/types.hpp>

void UserStarModel::initializeModel(bsoncxx::document::view document) {
    if (document.find("ownerId") != document.end() && document["ownerId"].type() == bsoncxx::type::k_utf8) {
        this->ownerId = document["ownerId"].get_string().value.to_string();
    } else {
        throw std::invalid_argument("`ownerId` gerekli bir alan ve geçerli bir string olmalıdır.");
    }

    if (document.find("petId") != document.end() && document["petId"].type() == bsoncxx::type::k_utf8) {
        this->petId = document["petId"].get_string().value.to_string();
    } else {
        throw std::invalid_argument("`petId` gerekli bir alan ve geçerli bir string olmalıdır.");
    }

    if (document.find("star") != document.end() && document["star"].type() == bsoncxx::type::k_int32) {
        this->star = document["star"].get_int32().value;
    } else {
        throw std::invalid_argument("`star` gerekli bir alan ve geçerli bir int32 olmalıdır.");
    }

    if (document.find("date") != document.end() && document["date"].type() == bsoncxx::type::k_date) {
        auto bson_date = document["date"].get_date().value;
        // Convert bsoncxx::types::b_date (milliseconds) to std::chrono::system_clock::time_point
        auto duration = std::chrono::milliseconds(bson_date.count());
        this->date = std::chrono::system_clock::time_point(duration);
    } else {
        this->date = std::chrono::system_clock::now(); // Varsayılan değer
    }
}

bool UserStarModel::validation() const {
    // ownerId ve petId alanları boş olamaz
    if (ownerId.empty()) {
        throw std::invalid_argument("`ownerId` boş olamaz.");
    }

    if (petId.empty()) {
        throw std::invalid_argument("`petId` boş olamaz.");
    }

    // star değeri geçerli bir aralıkta olmalıdır
    if (star < 0 || star > 5) { // Örneğin, yıldız 0-5 arasında olmalıdır
        throw std::invalid_argument("`star` değeri 0 ile 5 arasında olmalıdır.");
    }

    return true; // Tüm validasyonlar geçerse true döner
}

std::string UserStarModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    // Tarihi 'time_t' türüne dönüştür
    auto dateTime = std::chrono::system_clock::to_time_t(date);
    // 'bsoncxx::types::b_date' türünde bir tarih oluştur
    bsoncxx::types::b_date date{std::chrono::system_clock::from_time_t(dateTime)};

    document.append(
            bsoncxx::builder::basic::kvp("ownerId", ownerId),
            bsoncxx::builder::basic::kvp("petId", petId),
            bsoncxx::builder::basic::kvp("star", star),
            bsoncxx::builder::basic::kvp("date", date)
    );

    return bsoncxx::to_json(document.view());
}