#include "UserNationalIdModel.h"

#include <bsoncxx/types.hpp>
#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>

void UserNationalIdModel::initializeModel(bsoncxx::document::view document)
{
    if (document.find("isTcCitizen") != document.end() && document["isTcCitizen"].type() == bsoncxx::type::k_bool) {
        this->isTcCitizen = document["isTcCitizen"].get_bool().value;
    }
    if (document.find("iv") != document.end() && document["iv"].type() == bsoncxx::type::k_utf8) {
        this->iv = document["iv"].get_string().value.to_string();
    }
    if (document.find("idNumber") != document.end() && document["idNumber"].type() == bsoncxx::type::k_utf8) {
        this->idNumber = document["idNumber"].get_string().value.to_string();
    }
}

bool UserNationalIdModel::validation() const
{
    // idNumber isteğe bağlıdır ama varsa en fazla 11 karakter olabilir
    if (!idNumber.empty() && idNumber.length() > 11) {
        throw std::invalid_argument("`idNumber` alanı 11 karakterden az olmalıdır.");
    }

    // idNumber sadece rakamlardan oluşmalıdır (isteğe bağlı bir kontrol)
    if (!idNumber.empty() && !std::all_of(idNumber.begin(), idNumber.end(), ::isdigit)) {
        throw std::invalid_argument("`idNumber` alanı sadece rakamlardan oluşmalıdır.");
    }

    // iv alanı gereklidir ve boş olamaz
    if (iv.empty()) {
        throw std::invalid_argument("`iv` alanı boş olamaz.");
    }

    return true;
}

std::string UserNationalIdModel::to_json() const {
    bsoncxx::builder::basic::document document{};

    // BSON belgesi oluşturmak için `bsoncxx::builder::basic::kvp` kullanılır
    document.append(
            bsoncxx::builder::basic::kvp("isTcCitizen", isTcCitizen),
            bsoncxx::builder::basic::kvp("idNumber", idNumber)
    );

    return bsoncxx::to_json(document.view());
}
