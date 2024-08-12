#ifndef BENEK_SERVER_USERSCHEMA_H
#define BENEK_SERVER_USERSCHEMA_H

#include "models/MongoSchema/MongoSchema.h"

#include <bsoncxx/builder/basic/document.hpp>
#include <bsoncxx/builder/basic/array.hpp>
#include <bsoncxx/json.hpp>
#include <bsoncxx/types.hpp>
#include <chrono>
#include <ctime>
#include <string>
#include <iomanip>
#include <sstream>
#include <stdexcept>

#include "models/UserIdentityModel/UserIdentityModel.h"
#include "models/UserLocationModel/UserLocationModel.h"
#include "models/CardGuidModel/CardGuidModel.h"
#include "models/UserProfileImageModel/UserProfileImageModel.h"
#include "models/UserStarModel/UserStarModel.h"
#include "models/TagModel/TagModel.h"
#include "models/DeactivationModel/DeactivationModel.h"

class UserSchema : public MongoSchema {
private:
    static bsoncxx::types::b_date string_to_b_date(const std::string& date_str) ;

protected:
    void initializeSchema(bsoncxx::document::view document) override;
    bool validation() const override;

public:
    UserSchema()
            : MongoSchema("users"),
              identity(),
              location(),
              profileImg(),
              coverImg(),
              deactivation()
    {
        this->expires = std::nullopt;
    }

    bsoncxx::oid _id;
    std::string userName;
    int authRole = 0;
    std::string gender;
    std::string defaultImage;
    UserIdentityModel identity;
    std::string email;
    std::string phone;
    std::string iban;
    std::string password;
    bool isEmailVerified = false;
    bool isPhoneVerified = false;
    UserLocationModel location;
    std::vector<CardGuidModel> cardGuidies;
    UserProfileImageModel profileImg;
    UserProfileImageModel coverImg;
    std::vector<std::string> trustedIps;
    bool isLoggedInIpTrusted = true;
    std::vector<std::string> pets;
    bool isCareGiver = false;
    std::string careGiveGUID;
    std::vector<std::string> pastCaregivers;
    std::vector<std::string> caregiverCareer;
    std::vector<std::string> followingUsersOrPets;
    std::vector<std::string> blockedUsers;
    std::vector<std::string> followers;
    std::vector<std::string> saved;
    std::vector<UserStarModel> stars;
    std::vector<std::string> dependedUsers;
    std::vector<TagModel> interestingPetTags;
    DeactivationModel deactivation;

    // Timestamps
    std::string createdAt;
    std::string updatedAt;

    std::string to_json() const;
};

#endif //BENEK_SERVER_USERSCHEMA_H
