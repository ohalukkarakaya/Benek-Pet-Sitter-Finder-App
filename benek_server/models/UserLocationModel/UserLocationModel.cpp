#include "UserLocationModel.h"

#include <bsoncxx/types.hpp>
#include <bsoncxx/oid.hpp>
#include <bsoncxx/builder/basic/array.hpp>
#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <stdexcept>

void UserLocationModel::initializeModel(bsoncxx::document::view document) {
    if (document.find("country") != document.end() && document["country"].type() == bsoncxx::type::k_utf8) {
        this->country = document["country"].get_string().value.to_string();
    }

    if (document.find("city") != document.end() && document["city"].type() == bsoncxx::type::k_utf8) {
        this->city = document["city"].get_string().value.to_string();
    }

    if (document.find("lat") != document.end() && document["lat"].type() == bsoncxx::type::k_double) {
        this->lat = document["lat"].get_double().value;
    }

    if (document.find("lng") != document.end() && document["lng"].type() == bsoncxx::type::k_double) {
        this->lng = document["lng"].get_double().value;
    }
}


bool UserLocationModel::validation() const {
    // country alanı gereklidir ve boş olamaz
    if (country.empty()) {
        throw std::invalid_argument("`country` alanı gereklidir ve boş olamaz.");
    }

    // city alanı gereklidir ve boş olamaz
    if (city.empty()) {
        throw std::invalid_argument("`city` alanı gereklidir ve boş olamaz.");
    }

    // lat alanı gereklidir ve -90 ile 90 arasında olmalıdır
    if (lat < -90.0 || lat > 90.0) {
        throw std::invalid_argument("`lat` alanı -90 ile 90 arasında olmalıdır.");
    }

    // lng alanı gereklidir ve -180 ile 180 arasında olmalıdır
    if (lng < -180.0 || lng > 180.0) {
        throw std::invalid_argument("`lng` alanı -180 ile 180 arasında olmalıdır.");
    }

    return true; // Tüm validasyonlar geçerse true döner
}

std::string UserLocationModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    document.append(
            bsoncxx::builder::basic::kvp("country", country),
            bsoncxx::builder::basic::kvp("city", city),
            bsoncxx::builder::basic::kvp("lat", lat),
            bsoncxx::builder::basic::kvp("lng", lng)
    );

    return bsoncxx::to_json(document.view());
}