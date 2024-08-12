#ifndef BENEK_SERVER_DEACTIVATIONMODEL_H
#define BENEK_SERVER_DEACTIVATIONMODEL_H

#include <string>
#include <utility>
#include <bsoncxx/document/view.hpp>
#include <bsoncxx/types.hpp>
#include <stdexcept>

class DeactivationModel {
public:
    bool isDeactive = false;
    std::chrono::system_clock::time_point deactivationDate;
    bool isAboutToDelete = false;

    DeactivationModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};

#endif //BENEK_SERVER_DEACTIVATIONMODEL_H
