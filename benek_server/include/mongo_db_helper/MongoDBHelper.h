#ifndef MONGODBHELPER_H
#define MONGODBHELPER_H

#include <mongocxx/client.hpp>
#include <mongocxx/database.hpp>
#include <memory>

class MongoDBHelper {
public:
    static MongoDBHelper& getInstance();
    mongocxx::database getDatabase();

private:
    MongoDBHelper();
    ~MongoDBHelper();

    std::shared_ptr<mongocxx::client> client_;
};

#endif // MONGODBHELPER_H
