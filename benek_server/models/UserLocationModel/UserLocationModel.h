#ifndef BENEK_SERVER_USERLOCATIONMODEL_H
#define BENEK_SERVER_USERLOCATIONMODEL_H

#include <string>
#include <utility>
#include <bsoncxx/oid.hpp>
#include <optional>
#include <vector>
#include <optional>
#include <bsoncxx/oid.hpp>
#include <bsoncxx/builder/basic/kvp.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/oid.hpp>

class UserLocationModel {
public:
    std::string country;
    std::string city;
    double lat = -1;
    double lng = -1;

    UserLocationModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};

#endif //BENEK_SERVER_USERLOCATIONMODEL_H
