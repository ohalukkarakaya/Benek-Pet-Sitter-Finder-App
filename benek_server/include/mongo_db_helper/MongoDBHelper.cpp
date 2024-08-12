#include "MongoDBHelper.h"

#include "include/mongo_db_connection_pool/MongoDbConnectionPool.h"
#include "include/env_helper/EnvHelper.h"

MongoDBHelper::MongoDBHelper() {
    client_ = MongoDBConnectionPool::getInstance().getClient();
}

MongoDBHelper::~MongoDBHelper() {
    MongoDBConnectionPool::getInstance().releaseClient(client_);
}

MongoDBHelper& MongoDBHelper::getInstance() {
    static MongoDBHelper instance;
    return instance;
}

mongocxx::database MongoDBHelper::getDatabase() {
    std::string dbName = EnvHelper::getInstance().getFromEnv("DB_NAME");
    return client_->database(dbName);
}
