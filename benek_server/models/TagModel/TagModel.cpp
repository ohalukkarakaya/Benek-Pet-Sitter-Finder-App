#include "TagModel.h"

#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>

void TagModel::initializeModel(bsoncxx::document::view document) {
    if (document.find("petId") != document.end() && document["petId"].type() == bsoncxx::type::k_utf8) {
        this->petId = document["petId"].get_string().value.to_string();
    } else {
        throw std::invalid_argument("`petId` gerekli bir alan ve geçerli bir string olmalıdır.");
    }

    if (document.find("speciesId") != document.end() && document["speciesId"].type() == bsoncxx::type::k_utf8) {
        this->speciesId = document["speciesId"].get_string().value.to_string();
    } else {
        throw std::invalid_argument("`speciesId` gerekli bir alan ve geçerli bir string olmalıdır.");
    }
}

bool TagModel::validation() const {
    // `petId` ve `speciesId` alanlarının boş olup olmadığını kontrol ediyoruz.
    return !petId.empty() && !speciesId.empty();
}

std::string TagModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    document.append(
            bsoncxx::builder::basic::kvp("petId", petId),
            bsoncxx::builder::basic::kvp("speciesId", speciesId)
    );

    return bsoncxx::to_json(document.view());
}
