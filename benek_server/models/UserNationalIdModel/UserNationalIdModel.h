#ifndef BENEK_SERVER_USERNATIONALIDMODEL_H
#define BENEK_SERVER_USERNATIONALIDMODEL_H

#include <string>

#include <bsoncxx/oid.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/oid.hpp>

class UserNationalIdModel {
private:
    std::string iv;

public:
    bool isTcCitizen = false;
    std::string idNumber;

    // Constructor
    UserNationalIdModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};

#endif //BENEK_SERVER_USERNATIONALIDMODEL_H
