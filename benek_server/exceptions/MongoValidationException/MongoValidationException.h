#ifndef BENEK_SERVER_MONGOVALIDATIONEXCEPTION_H
#define BENEK_SERVER_MONGOVALIDATIONEXCEPTION_H

#include <exception>
#include <string>

class MongoValidationException : public std::exception {
public:
    MongoValidationException(std::string collectionName);

    const char* what() const noexcept override;
    const std::string& get_collection_name() const;
    const std::string& get_object_id() const;

private:
    std::string collectionName;
    mutable std::string message;
};

#endif //BENEK_SERVER_MONGOVALIDATIONEXCEPTION_H
