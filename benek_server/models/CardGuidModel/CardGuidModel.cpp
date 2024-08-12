#include "CardGuidModel.h"

#include <bsoncxx/types.hpp>
#include <stdexcept>
#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>

void CardGuidModel::initializeModel(bsoncxx::document::view document) {
    if (document.find("cardName") != document.end() && document["cardName"].type() == bsoncxx::type::k_utf8) {
        this->cardName = document["cardName"].get_string().value.to_string();
    }

    if (document.find("cardGuid") != document.end() && document["cardGuid"].type() == bsoncxx::type::k_utf8) {
        this->cardGuid = document["cardGuid"].get_string().value.to_string();
    }
}

bool CardGuidModel::validation() const {
    // cardName alanı gereklidir ve boş olamaz
    if (cardName.empty()) {
        throw std::invalid_argument("`cardName` alanı gereklidir ve boş olamaz.");
    }

    // cardGuid alanı gereklidir ve boş olamaz
    if (cardGuid.empty()) {
        throw std::invalid_argument("`cardGuid` alanı gereklidir ve boş olamaz.");
    }

    return true; // Tüm validasyonlar geçerse true döner
}

bsoncxx::document::value CardGuidModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    document.append(
            bsoncxx::builder::basic::kvp("cardName", cardName),
            bsoncxx::builder::basic::kvp("cardGuid", cardGuid)
    );

    return document.extract();
}
