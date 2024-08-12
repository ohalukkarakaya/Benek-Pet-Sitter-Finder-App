#ifndef BENEK_SERVER_USERSTARMODEL_H
#define BENEK_SERVER_USERSTARMODEL_H

#include <string>
#include <utility>
#include <bsoncxx/types.hpp>

class UserStarModel {
public:
    std::string ownerId;
    std::string petId;
    int star = -1;
    std::chrono::system_clock::time_point date;

    UserStarModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};

#endif //BENEK_SERVER_USERSTARMODEL_H
