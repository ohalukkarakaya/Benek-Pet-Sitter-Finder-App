#ifndef BENEK_SERVER_USERIDENTITYMODEL_H
#define BENEK_SERVER_USERIDENTITYMODEL_H

#include <bsoncxx/oid.hpp>
#include <string>
#include <optional>
#include <utility>
#include <vector>
#include <optional>
#include <bsoncxx/oid.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/oid.hpp>

#include "models/UserNationalIdModel/UserNationalIdModel.h"

class UserIdentityModel {
public:
    std::string firstName;
    std::optional<std::string> middleName;
    std::string lastName;
    UserNationalIdModel nationalId;
    std::string birthDay;
    std::string openAdress;
    std::string job;
    std::vector<std::string> certificates;
    std::string bio;

    UserIdentityModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};


#endif //BENEK_SERVER_USERIDENTITYMODEL_H