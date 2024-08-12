#ifndef BENEK_SERVER_CARDGUIDMODEL_H
#define BENEK_SERVER_CARDGUIDMODEL_H

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

class CardGuidModel {
public:
    std::string cardName;
    std::string cardGuid;

    CardGuidModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    bsoncxx::document::value to_json() const;
};

#endif //BENEK_SERVER_CARDGUIDMODEL_H
