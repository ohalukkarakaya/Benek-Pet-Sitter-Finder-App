#ifndef BENEK_SERVER_NOTFOUNDEXCEPTION_H
#define BENEK_SERVER_NOTFOUNDEXCEPTION_H

#include <exception>
#include <optional>
#include <string>


class NotFoundException : public std::exception {
public:
    NotFoundException(std::string collectionName, std::optional<std::string> objectId = std::nullopt, std::optional<std::string> methodName = std::nullopt);

    const char* what() const noexcept override;
    const std::string& get_collection_name() const;
    const std::optional<std::string>& get_object_id() const;

private:
    std::string collectionName;
    std::optional<std::string> objectId;
    std::optional<std::string> methodName;
    mutable std::string message;
};

#endif //BENEK_SERVER_NOTFOUNDEXCEPTION_H
