#ifndef MONGODBCONNECTIONPOOL_H
#define MONGODBCONNECTIONPOOL_H

#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>
#include <queue>
#include <memory>
#include <mutex>

class MongoDBConnectionPool {
public:
    static MongoDBConnectionPool& getInstance();
    std::shared_ptr<mongocxx::client> getClient();
    void releaseClient(std::shared_ptr<mongocxx::client> client);

private:
    MongoDBConnectionPool();
    ~MongoDBConnectionPool();

    std::queue<std::shared_ptr<mongocxx::client>> pool_;
    std::mutex mutex_;
    std::string dbUrl_;
};

#endif // MONGODBCONNECTIONPOOL_H
