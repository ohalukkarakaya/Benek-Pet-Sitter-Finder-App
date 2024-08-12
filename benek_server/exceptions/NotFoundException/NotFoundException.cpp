#include "NotFoundException.h"
#include "constants/ErrorMessages.h"

#include <format>

NotFoundException::NotFoundException(std::string collectionName, std::optional<std::string> objectId, std::optional<std::string> methodName)
        : collectionName(std::move(collectionName)), objectId(std::move(objectId)) {

    if (objectId.has_value() && methodName.has_value()) {
        message = std::format(ErrorMessages::NOT_FOUND_EXCEPTION_DESC, *methodName, this->collectionName, *objectId);
    } else if (methodName.has_value()) {
        message = std::format(ErrorMessages::NOT_FOUND_EXCEPTION_DESC, *methodName, this->collectionName, "none");
    } else if (objectId.has_value()) {
        message = std::format(ErrorMessages::NOT_FOUND_EXCEPTION_DESC, "none", this->collectionName, *objectId);
    } else {
        message = std::format(ErrorMessages::NOT_FOUND_EXCEPTION_DESC, "none", this->collectionName, "none");
    }
}

const char* NotFoundException::what() const noexcept {
    return message.c_str();
}

const std::string& NotFoundException::get_collection_name() const {
    return collectionName;
}

const std::optional<std::string>& NotFoundException::get_object_id() const {
    return objectId;
}
