#ifndef BENEK_SERVER_ERRORMESSAGES_H
#define BENEK_SERVER_ERRORMESSAGES_H

#include <string>

class ErrorMessages {
public:
    static constexpr char MONGO_EXCEPTION[] = "Error: {} - {}";
    static constexpr char MONGO_EXCEPTION_DESC[] = "method_name: {}, object_id: {}";
    static constexpr char MONGO_VALIDATION_EXCEPTION[] = "Validation Error: {}";
    static constexpr char NOT_FOUND_EXCEPTION_DESC[] = R"(method_name: {}, "Object with ID " {} " not found in collection " {} "'.")";
};

#endif //BENEK_SERVER_ERRORMESSAGES_H
