#include "DeactivationModel.h"

#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>

void DeactivationModel::initializeModel(bsoncxx::document::view document) {
    if (document.find("isDeactive") != document.end() && document["isDeactive"].type() == bsoncxx::type::k_bool) {
        this->isDeactive = document["isDeactive"].get_bool().value;
    }

    if (document.find("deactivationDate") != document.end() && document["deactivationDate"].type() == bsoncxx::type::k_date) {
        auto date_value = document["deactivationDate"].get_date().value;

        // BSON tarihini std::chrono::system_clock::time_point'e dönüştür
        auto milliseconds_since_epoch = std::chrono::milliseconds{date_value.count()};
        this->deactivationDate = std::chrono::system_clock::time_point{milliseconds_since_epoch};
    }

    if (document.find("isAboutToDelete") != document.end() && document["isAboutToDelete"].type() == bsoncxx::type::k_bool) {
        this->isAboutToDelete = document["isAboutToDelete"].get_bool().value;
    }
}

bool DeactivationModel::validation() const {
    // `isDeactive` ve `isAboutToDelete` alanlarının geçerli olup olmadığını kontrol ediyoruz.
    // Burada `deactivationDate` alanı için geçerlilik kontrolü yapılmamaktadır.
    return !deactivationDate.time_since_epoch().count() || isDeactive || isAboutToDelete;
}

std::string DeactivationModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    // `deactivationDate` için `time_t` değeri oluştur
    auto deactivationDateTime = std::chrono::system_clock::to_time_t(deactivationDate);

    // `bsoncxx::types::b_date` oluştur
    bsoncxx::types::b_date date{std::chrono::system_clock::from_time_t(deactivationDateTime)};

    document.append(
            bsoncxx::builder::basic::kvp("isDeactive", isDeactive),
            bsoncxx::builder::basic::kvp("deactivationDate", date),
            bsoncxx::builder::basic::kvp("isAboutToDelete", isAboutToDelete)
    );

    return bsoncxx::to_json(document.view());
}