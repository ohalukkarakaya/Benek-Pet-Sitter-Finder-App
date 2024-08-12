#include "UserProfileImageModel.h"

#include <bsoncxx/types.hpp>
#include <stdexcept>
#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>

void UserProfileImageModel::initializeModel(bsoncxx::document::view document) {
    if (document.find("isDefaultImg") != document.end() && document["isDefaultImg"].type() == bsoncxx::type::k_bool) {
        this->isDefaultImg = document["isDefaultImg"].get_bool().value;
    }

    if (document.find("recordedImgName") != document.end() && document["recordedImgName"].type() == bsoncxx::type::k_utf8) {
        this->recordedImgName = document["recordedImgName"].get_string().value.to_string();
    }

    if (document.find("imgUrl") != document.end() && document["imgUrl"].type() == bsoncxx::type::k_utf8) {
        this->imgUrl = document["imgUrl"].get_string().value.to_string();
    }
}

bool UserProfileImageModel::validation() const {
    // imgUrl alanı boş olabilir, ama doluysa geçerli bir URL olup olmadığını kontrol edebilirsiniz
    if (!imgUrl.empty()) {
        // Basit bir URL kontrolü yapılabilir, örneğin https:// ile başlaması gibi
        throw std::invalid_argument("`imgUrl` geçerli bir URL olmalıdır.");
    }

    // recordedImgName herhangi bir uzunluk kısıtlaması gerektirmeyebilir, ancak buraya eklenebilir
    return true; // Tüm validasyonlar geçerse true döner
}

std::string UserProfileImageModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    document.append(
            bsoncxx::builder::basic::kvp("isDefaultImg", isDefaultImg),
            bsoncxx::builder::basic::kvp("recordedImgName", recordedImgName),
            bsoncxx::builder::basic::kvp("imgUrl", imgUrl)
    );

    return bsoncxx::to_json(document.view());
}

