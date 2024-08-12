#ifndef MONGO_SCHEMA_EXCEPTION_H
#define MONGO_SCHEMA_EXCEPTION_H

#include <exception>
#include <string>

class MongoSchemaException : public std::exception {
public:
    MongoSchemaException(std::string methodName, std::string collectionName, std::string object_id);

    const char* what() const noexcept override;
    const std::string& get_collection_name() const;
    const std::string& get_object_id() const;

private:
    std::string methodName;
    std::string collectionName;
    std::string object_id;
    mutable std::string message;
};

#endif // MONGO_SCHEMA_EXCEPTION_H
