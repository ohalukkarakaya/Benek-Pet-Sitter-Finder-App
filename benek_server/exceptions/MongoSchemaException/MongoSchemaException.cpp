#include "MongoSchemaException.h"
#include "constants/ErrorMessages.h"

#include <format>

MongoSchemaException::MongoSchemaException(std::string methodName, std::string collectionName, std::string object_id)
        : methodName(std::move(methodName)), collectionName(std::move(collectionName)), object_id(std::move(object_id)) {

    message = std::format(ErrorMessages::MONGO_EXCEPTION_DESC, methodName, object_id);
    message = std::format(ErrorMessages::MONGO_EXCEPTION, collectionName, message);
}

const char* MongoSchemaException::what() const noexcept {
    return message.c_str();
}

const std::string& MongoSchemaException::get_collection_name() const {
    return collectionName;
}

const std::string& MongoSchemaException::get_object_id() const {
    return object_id;
}
