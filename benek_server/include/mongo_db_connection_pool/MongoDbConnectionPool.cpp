#include <mongocxx/instance.hpp>
#include "MongoDbConnectionPool.h"
#include "../env_helper/EnvHelper.h"

MongoDBConnectionPool::MongoDBConnectionPool() {
    static mongocxx::instance instance{};
    dbUrl_ = EnvHelper::getInstance().getFromEnv("DB");
}

MongoDBConnectionPool::~MongoDBConnectionPool() = default;

MongoDBConnectionPool& MongoDBConnectionPool::getInstance() {
    static MongoDBConnectionPool instance;
    return instance;
}

std::shared_ptr<mongocxx::client> MongoDBConnectionPool::getClient() {
    std::lock_guard<std::mutex> lock(mutex_);

    if (!pool_.empty()) {
        auto client = pool_.front();
        pool_.pop();
        return client;
    }

    return std::make_shared<mongocxx::client>(mongocxx::uri{ dbUrl_ });
}

void MongoDBConnectionPool::releaseClient(std::shared_ptr<mongocxx::client> client) {
    std::lock_guard<std::mutex> lock(mutex_);
    pool_.push(client);
}
