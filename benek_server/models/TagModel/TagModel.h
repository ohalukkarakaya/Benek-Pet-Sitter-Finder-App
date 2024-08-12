#ifndef BENEK_SERVER_TAGMODEL_H
#define BENEK_SERVER_TAGMODEL_H

#include <string>
#include <bsoncxx/document/view.hpp>
#include <bsoncxx/types.hpp>
#include <stdexcept>

class TagModel {
public:
    std::string petId;
    std::string speciesId;

    TagModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};

#endif //BENEK_SERVER_TAGMODEL_H
