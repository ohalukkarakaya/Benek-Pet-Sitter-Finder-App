#include "UserIdentityModel.h"

#include <bsoncxx/types.hpp>
#include <stdexcept>
#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/builder/basic/array.hpp>


void UserIdentityModel::initializeModel(bsoncxx::document::view document)
{
    if (document.find("firstName") != document.end() && document["firstName"].type() == bsoncxx::type::k_utf8) {
        this->firstName = document["firstName"].get_string().value.to_string();
    }

    if (document.find("middleName") != document.end() && document["middleName"].type() == bsoncxx::type::k_utf8) {
        this->middleName = document["middleName"].get_string().value.to_string();
    }

    if (document.find("lastName") != document.end() && document["lastName"].type() == bsoncxx::type::k_utf8) {
        this->lastName = document["lastName"].get_string().value.to_string();
    }

    if (document.find("nationalId") != document.end() && document["nationalId"].type() == bsoncxx::type::k_document) {
        auto subdocument = document["nationalId"].get_document().view();
        this->nationalId.initializeModel(subdocument);
    }

    if (document.find("birthDay") != document.end() && document["birthDay"].type() == bsoncxx::type::k_utf8) {
        this->birthDay = document["birthDay"].get_string().value.to_string();
    }

    if (document.find("openAdress") != document.end() && document["openAdress"].type() == bsoncxx::type::k_utf8) {
        this->openAdress = document["openAdress"].get_string().value.to_string();
    }

    if (document.find("job") != document.end() && document["job"].type() == bsoncxx::type::k_utf8) {
        this->job = document["job"].get_string().value.to_string();
    }

    if (document.find("certificates") != document.end() && document["certificates"].type() == bsoncxx::type::k_array) {
        auto array = document["certificates"].get_array().value;
        for (const auto& element : array) {
            if (element.type() == bsoncxx::type::k_utf8) {
                this->certificates.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("bio") != document.end() && document["bio"].type() == bsoncxx::type::k_utf8) {
        this->bio = document["bio"].get_string().value.to_string();
    }
}

bool UserIdentityModel::validation() const
{
    // firstName gereklidir ve en fazla 10 karakter olabilir
    if (firstName.empty() || firstName.length() > 10) {
        throw std::invalid_argument("`firstName` alanı gereklidir ve 10 karakterden az olmalıdır.");
    }

    // middleName isteğe bağlıdır ama varsa en fazla 10 karakter olabilir
    if (middleName.has_value() && middleName->length() > 10) {
        throw std::invalid_argument("`middleName` alanı 10 karakterden az olmalıdır.");
    }

    // lastName gereklidir ve en fazla 20 karakter olabilir
    if (lastName.empty() || lastName.length() > 20) {
        throw std::invalid_argument("`lastName` alanı gereklidir ve 20 karakterden az olmalıdır.");
    }

    // openAdress isteğe bağlıdır ama varsa en fazla 200 karakter olabilir
    if (!openAdress.empty() && openAdress.length() > 200) {
        throw std::invalid_argument("`openAdress` alanı 200 karakterden az olmalıdır.");
    }

    // job isteğe bağlıdır ama varsa en fazla 30 karakter olabilir
    if (!job.empty() && job.length() > 30) {
        throw std::invalid_argument("`job` alanı 30 karakterden az olmalıdır.");
    }

    // bio isteğe bağlıdır ama varsa en fazla 150 karakter olabilir
    if (!bio.empty() && bio.length() > 150) {
        throw std::invalid_argument("`bio` alanı 150 karakterden az olmalıdır.");
    }

    // nationalId doğrulaması
    if (!nationalId.validation()) {
        throw std::invalid_argument("`nationalId` alanı geçersiz.");
    }

    return true; // Tüm validasyonlar geçerse true döner
}

std::string UserIdentityModel::to_json() const {
    bsoncxx::builder::basic::document document{};
    bsoncxx::builder::basic::array certificates_array{};

    for (const auto& cert : certificates) {
        certificates_array.append(cert);
    }

    // `bsoncxx::builder::basic::kvp` kullanarak belgenizi oluşturun
    document.append(
            bsoncxx::builder::basic::kvp("firstName", firstName),
            bsoncxx::builder::basic::kvp("middleName", middleName.value_or("")),
            bsoncxx::builder::basic::kvp("lastName", lastName),
            bsoncxx::builder::basic::kvp("nationalId", nationalId.to_json()),
            bsoncxx::builder::basic::kvp("birthDay", birthDay),
            bsoncxx::builder::basic::kvp("openAdress", openAdress),
            bsoncxx::builder::basic::kvp("job", job),
            bsoncxx::builder::basic::kvp("certificates", certificates_array),
            bsoncxx::builder::basic::kvp("bio", bio)
    );

    return bsoncxx::to_json(document.view());
}