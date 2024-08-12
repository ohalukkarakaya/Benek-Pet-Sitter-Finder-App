#include "UserSchema.h"

void UserSchema::initializeSchema(bsoncxx::document::view document) {
    // ID
    if (document.find("_id") != document.end()) {
        _id = document["_id"].get_oid().value;
    }

    // Basic Fields
    if (document.find("userName") != document.end() && document["userName"].type() == bsoncxx::type::k_utf8) {
        userName = document["userName"].get_string().value.to_string();
    }

    if (document.find("authRole") != document.end() && document["authRole"].type() == bsoncxx::type::k_int32) {
        authRole = document["authRole"].get_int32().value;
    }

    if (document.find("gender") != document.end() && document["gender"].type() == bsoncxx::type::k_utf8) {
        gender = document["gender"].get_string().value.to_string();
    }

    if (document.find("defaultImage") != document.end() && document["defaultImage"].type() == bsoncxx::type::k_utf8) {
        defaultImage = document["defaultImage"].get_string().value.to_string();
    }

    // User Identity
    if (document.find("identity") != document.end() && document["identity"].type() == bsoncxx::type::k_document) {
        identity.initializeModel(document["identity"].get_document().view());
    }

    // Other Fields
    if (document.find("email") != document.end() && document["email"].type() == bsoncxx::type::k_utf8) {
        email = document["email"].get_string().value.to_string();
    }

    if (document.find("phone") != document.end() && document["phone"].type() == bsoncxx::type::k_utf8) {
        phone = document["phone"].get_string().value.to_string();
    }

    if (document.find("iban") != document.end() && document["iban"].type() == bsoncxx::type::k_utf8) {
        iban = document["iban"].get_string().value.to_string();
    }

    if (document.find("password") != document.end() && document["password"].type() == bsoncxx::type::k_utf8) {
        password = document["password"].get_string().value.to_string();
    }

    if (document.find("isEmailVerified") != document.end() && document["isEmailVerified"].type() == bsoncxx::type::k_bool) {
        isEmailVerified = document["isEmailVerified"].get_bool().value;
    }

    if (document.find("isPhoneVerified") != document.end() && document["isPhoneVerified"].type() == bsoncxx::type::k_bool) {
        isPhoneVerified = document["isPhoneVerified"].get_bool().value;
    }

    if (document.find("location") != document.end() && document["location"].type() == bsoncxx::type::k_document) {
        location.initializeModel(document["location"].get_document().view());
    }

    if (document.find("cardGuidies") != document.end() && document["cardGuidies"].type() == bsoncxx::type::k_array) {
        auto array_view = document["cardGuidies"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_document) {
                CardGuidModel cardGuid;
                cardGuid.initializeModel(element.get_document().view());
                cardGuidies.push_back(cardGuid);
            }
        }
    }

    if (document.find("profileImg") != document.end() && document["profileImg"].type() == bsoncxx::type::k_document) {
        profileImg.initializeModel(document["profileImg"].get_document().view());
    }

    if (document.find("coverImg") != document.end() && document["coverImg"].type() == bsoncxx::type::k_document) {
        coverImg.initializeModel(document["coverImg"].get_document().view());
    }

    if (document.find("trustedIps") != document.end() && document["trustedIps"].type() == bsoncxx::type::k_array) {
        auto array_view = document["trustedIps"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                trustedIps.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("isLoggedInIpTrusted") != document.end() && document["isLoggedInIpTrusted"].type() == bsoncxx::type::k_bool) {
        isLoggedInIpTrusted = document["isLoggedInIpTrusted"].get_bool().value;
    }

    if (document.find("pets") != document.end() && document["pets"].type() == bsoncxx::type::k_array) {
        auto array_view = document["pets"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                pets.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("isCareGiver") != document.end() && document["isCareGiver"].type() == bsoncxx::type::k_bool) {
        isCareGiver = document["isCareGiver"].get_bool().value;
    }

    if (document.find("careGiveGUID") != document.end() && document["careGiveGUID"].type() == bsoncxx::type::k_utf8) {
        careGiveGUID = document["careGiveGUID"].get_string().value.to_string();
    }

    if (document.find("pastCaregivers") != document.end() && document["pastCaregivers"].type() == bsoncxx::type::k_array) {
        auto array_view = document["pastCaregivers"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                pastCaregivers.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("caregiverCareer") != document.end() && document["caregiverCareer"].type() == bsoncxx::type::k_array) {
        auto array_view = document["caregiverCareer"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                caregiverCareer.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("followingUsersOrPets") != document.end() && document["followingUsersOrPets"].type() == bsoncxx::type::k_array) {
        auto array_view = document["followingUsersOrPets"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                followingUsersOrPets.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("blockedUsers") != document.end() && document["blockedUsers"].type() == bsoncxx::type::k_array) {
        auto array_view = document["blockedUsers"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                blockedUsers.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("followers") != document.end() && document["followers"].type() == bsoncxx::type::k_array) {
        auto array_view = document["followers"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                followers.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("saved") != document.end() && document["saved"].type() == bsoncxx::type::k_array) {
        auto array_view = document["saved"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                saved.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("stars") != document.end() && document["stars"].type() == bsoncxx::type::k_array) {
        auto array_view = document["stars"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_document) {
                UserStarModel star;
                star.initializeModel(element.get_document().view());
                stars.push_back(star);
            }
        }
    }

    if (document.find("dependedUsers") != document.end() && document["dependedUsers"].type() == bsoncxx::type::k_array) {
        auto array_view = document["dependedUsers"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_utf8) {
                dependedUsers.push_back(element.get_string().value.to_string());
            }
        }
    }

    if (document.find("interestingPetTags") != document.end() && document["interestingPetTags"].type() == bsoncxx::type::k_array) {
        auto array_view = document["interestingPetTags"].get_array().value;
        for (const auto& element : array_view) {
            if (element.type() == bsoncxx::type::k_document) {
                TagModel tag;
                tag.initializeModel(element.get_document().view());
                interestingPetTags.push_back(tag);
            }
        }
    }

    if (document.find("deactivation") != document.end() && document["deactivation"].type() == bsoncxx::type::k_document) {
        deactivation.initializeModel(document["deactivation"].get_document().view());
    }

    // Timestamps
    if (document.find("createdAt") != document.end() && document["createdAt"].type() == bsoncxx::type::k_utf8) {
        createdAt = document["createdAt"].get_string().value.to_string();
    }

    if (document.find("updatedAt") != document.end() && document["updatedAt"].type() == bsoncxx::type::k_utf8) {
        updatedAt = document["updatedAt"].get_string().value.to_string();
    }
}

bool UserSchema::validation() const {
    // Basic Fields
    if (userName.empty() || email.empty() || password.empty()) {
        return false;
    }

    // Nested Models Validation
    if (!identity.validation() || !location.validation() || !profileImg.validation() || !coverImg.validation() || !deactivation.validation()) {
        return false;
    }

    // Example of additional validation
    if (authRole < 0 || authRole > 4) {
        return false;
    }

    return true;
}

bsoncxx::types::b_date UserSchema::string_to_b_date(const std::string& date_str) {
    std::tm tm = {};
    std::istringstream ss(date_str);
    ss >> std::get_time(&tm, "%Y-%m-%d %H:%M:%S");

    if (ss.fail()) {
        throw std::runtime_error("Invalid date format");
    }

    // Convert tm to time_t
    std::time_t time = std::mktime(&tm);

    // Convert time_t to system_clock::time_point
    auto time_point = std::chrono::system_clock::from_time_t(time);

    // Convert time_point to b_date
    return bsoncxx::types::b_date(time_point);
}


std::string UserSchema::to_json() const {
    bsoncxx::builder::basic::document document{};

    // Prepare Lists
    bsoncxx::builder::basic::array card_guid_array_builder;
    bsoncxx::builder::basic::array trusted_ipies_builder;
    bsoncxx::builder::basic::array pets_builder;
    bsoncxx::builder::basic::array past_caregivers_builder;
    bsoncxx::builder::basic::array caregiver_career_builder;
    bsoncxx::builder::basic::array following_users_or_pets_builder;
    bsoncxx::builder::basic::array blocked_users_builder;
    bsoncxx::builder::basic::array followers_builder;
    bsoncxx::builder::basic::array saved_builder;
    bsoncxx::builder::basic::array stars_builder;
    bsoncxx::builder::basic::array depended_users_builder;
    bsoncxx::builder::basic::array interesting_pet_tags_builder;

    for (const auto& cardGuid : cardGuidies) {
        auto bson = cardGuid.to_json();
        card_guid_array_builder.append(bson);
    }

    for (const auto& trusted_ip : trustedIps) {
        trusted_ipies_builder.append(trusted_ip);
    }

    for (const auto& pet : pets) {
        pets_builder.append(pet);
    }

    for (const auto& past_caregiver : pastCaregivers) {
        past_caregivers_builder.append(past_caregiver);
    }

    for (const auto& caregiver_career : caregiverCareer) {
        caregiver_career_builder.append(caregiver_career);
    }

    for (const auto& following_user_or_pet : followingUsersOrPets) {
        following_users_or_pets_builder.append(following_user_or_pet);
    }

    for (const auto& blocked_user : blockedUsers) {
        blocked_users_builder.append(blocked_user);
    }

    for (const auto& follower : followers) {
        followers_builder.append(follower);
    }

    for (const auto& save : saved) {
        saved_builder.append(save);
    }

    for (const auto& star : stars) {
        auto bson = star.to_json();
        stars_builder.append(bson);
    }

    for (const auto& depended : dependedUsers) {
        depended_users_builder.append(depended);
    }

    for (const auto& interesting_pet : interestingPetTags) {
        auto bson = interesting_pet.to_json();
        interesting_pet_tags_builder.append(bson);
    }



    // `createdAt` ve `updatedAt` için `time_t` değerleri oluştur
    bsoncxx::types::b_date createdAtDate = string_to_b_date(createdAt);
    bsoncxx::types::b_date updatedAtDate = string_to_b_date(updatedAt);

    document.append(
            bsoncxx::builder::basic::kvp("_id", _id),
            bsoncxx::builder::basic::kvp("userName", userName),
            bsoncxx::builder::basic::kvp("authRole", authRole),
            bsoncxx::builder::basic::kvp("gender", gender),
            bsoncxx::builder::basic::kvp("defaultImage", defaultImage),
            bsoncxx::builder::basic::kvp("identity", identity.to_json()),
            bsoncxx::builder::basic::kvp("email", email),
            bsoncxx::builder::basic::kvp("phone", phone),
            bsoncxx::builder::basic::kvp("iban", iban),
            bsoncxx::builder::basic::kvp("password", password),
            bsoncxx::builder::basic::kvp("isEmailVerified", isEmailVerified),
            bsoncxx::builder::basic::kvp("isPhoneVerified", isPhoneVerified),
            bsoncxx::builder::basic::kvp("location", location.to_json()),
            bsoncxx::builder::basic::kvp("cardGuidies", card_guid_array_builder),
            bsoncxx::builder::basic::kvp("profileImg", profileImg.to_json()),
            bsoncxx::builder::basic::kvp("coverImg", coverImg.to_json()),
            bsoncxx::builder::basic::kvp("trustedIps", trusted_ipies_builder),
            bsoncxx::builder::basic::kvp("pets", pets_builder),
            bsoncxx::builder::basic::kvp("isCareGiver", isCareGiver),
            bsoncxx::builder::basic::kvp("careGiveGUID", careGiveGUID),
            bsoncxx::builder::basic::kvp("pastCaregivers", past_caregivers_builder),
            bsoncxx::builder::basic::kvp("caregiverCareer", caregiver_career_builder),
            bsoncxx::builder::basic::kvp("followingUsersOrPets", following_users_or_pets_builder),
            bsoncxx::builder::basic::kvp("blockedUsers", blocked_users_builder),
            bsoncxx::builder::basic::kvp("followers", followers_builder),
            bsoncxx::builder::basic::kvp("saved", saved_builder),
            bsoncxx::builder::basic::kvp("stars", stars_builder),
            bsoncxx::builder::basic::kvp("dependedUsers", depended_users_builder),
            bsoncxx::builder::basic::kvp("interestingPetTags", interesting_pet_tags_builder),
            bsoncxx::builder::basic::kvp("deactivation", deactivation.to_json()),
            bsoncxx::builder::basic::kvp("createdAt", createdAtDate),
            bsoncxx::builder::basic::kvp("updatedAt", updatedAtDate)
    );

    return bsoncxx::to_json(document.view());
}




