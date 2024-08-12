#include "MongoValidationException.h"
#include "constants/ErrorMessages.h"

#include <format>

MongoValidationException::MongoValidationException(std::string collectionName)
        : collectionName(std::move(collectionName)) {

    message = std::format(ErrorMessages::MONGO_VALIDATION_EXCEPTION, collectionName);
}

const char* MongoValidationException::what() const noexcept {
    return message.c_str();
}

const std::string& MongoValidationException::get_collection_name() const {
    return collectionName;
}
