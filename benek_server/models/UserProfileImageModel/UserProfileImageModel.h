#ifndef BENEK_SERVER_USERPROFILEIMAGEMODEL_H
#define BENEK_SERVER_USERPROFILEIMAGEMODEL_H

#include <string>
#include <utility>
#include <bsoncxx/types.hpp>

class UserProfileImageModel {
public:
    bool isDefaultImg = true;
    std::string recordedImgName;
    std::string imgUrl;

    UserProfileImageModel() = default;

    void initializeModel(bsoncxx::document::view document);
    bool validation() const;

    std::string to_json() const;
};

#endif //BENEK_SERVER_USERPROFILEIMAGEMODEL_H
