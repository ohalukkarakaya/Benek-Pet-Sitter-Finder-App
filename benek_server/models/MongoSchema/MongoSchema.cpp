#include "MongoSchema.h"
#include <bsoncxx/json.hpp>
#include <utility>
#include "include/env_helper/EnvHelper.h"

#include "exceptions/MongoSchemaException/MongoSchemaException.h"
#include "exceptions/MongoValidationException/MongoValidationException.h"
#include "exceptions/NotFoundException/NotFoundException.h"


using namespace bsoncxx::builder::basic;

MongoSchema::MongoSchema(std::string collectionName, bsoncxx::oid id)
        : collectionName(std::move(collectionName)), _id(id) {}

bool MongoSchema::isValid() const {
    bool isValid = validation();
    if( !isValid ){
        throw MongoValidationException(collectionName);
    }

    return true;
}

std::optional<bsoncxx::document::view> MongoSchema::create_ttl_index() const {
    if ( !expires.has_value() ) {
        return std::nullopt;
    }

    auto builder = bsoncxx::builder::basic::make_document(
            bsoncxx::builder::basic::kvp("expireAfterSeconds", expires.value())
    );
    return builder.view();
}

std::optional<bsoncxx::document::view> MongoSchema::create_created_at_index() const {
    if ( !created_at_option.has_value() ) {
        return std::nullopt;
    }

    auto builder = bsoncxx::builder::basic::make_document(
            bsoncxx::builder::basic::kvp("createdAt", created_at_option.value())
    );
    return builder.view();
}

mongocxx::collection MongoSchema::get_collection(const mongocxx::client& client) const {
    std::string dbName = EnvHelper::getInstance().getFromEnv("DB_NAME");
    auto db = client[dbName];
    return db[collectionName];
}

bool MongoSchema::validation() const {
    return true;
}

void MongoSchema::insert_one(const std::string& jsonDocument, const mongocxx::client& client) {
    try {
        isValid();

        auto collection = get_collection(client);

        std::optional<bsoncxx::document::view> expire_time = create_ttl_index();
        if( expire_time.has_value() ){
            collection.create_index(expire_time.value());
        }

        std::optional<bsoncxx::document::view> create_at_time = create_created_at_index();
        if( expire_time.has_value() ){
            collection.create_index(expire_time.value());
        }

        auto doc = bsoncxx::from_json(jsonDocument);
        auto result = collection.insert_one(doc.view());

        if ( !result ) {
            return;
        }

        // MongoDB'de yeni eklenen belgeyi sorgulamak için ID'yi al
        bsoncxx::oid inserted_id = result->inserted_id().get_oid().value;

        // ID'yi kullanarak eklenen belgeyi tekrar sorgula
        auto inserted_doc = collection.find_one(
                make_document(kvp("_id", inserted_id))
        );

        if ( !inserted_doc ){
            return;
        }

        // initializeSchema metodunu çağır ve classı doldur
        initializeSchema(inserted_doc->view());
    } catch (const std::exception& e) {
        throw MongoSchemaException("insert_one", collectionName, _id.to_string());
    }
}

std::vector<bsoncxx::document::view> MongoSchema::insert_many(const std::vector<std::string>& jsonDocuments, const mongocxx::client& client) {
    std::vector<bsoncxx::document::view> insertedDocs;
    try {
        auto collection = get_collection(client);
        std::vector<bsoncxx::document::value> docs;

        docs.reserve(jsonDocuments.size());
        for (const auto& jsonDoc : jsonDocuments) {
            docs.push_back(bsoncxx::from_json(jsonDoc));
        }

        auto result = collection.insert_many(docs);
        if( !result ) {
            return insertedDocs; // Boş Vector Döndür
        }

        for (const auto& id : result->inserted_ids()) {
            if (id.second.type() != bsoncxx::type::k_oid){
                break;
            }

            auto inserted_doc = collection.find_one(make_document(kvp("_id", id.second.get_oid().value)));
            if ( !inserted_doc ) {
                break;
            }

            if (id.second.type() == bsoncxx::type::k_oid) {
                insertedDocs.push_back(inserted_doc->view());
            }
        }

        return insertedDocs;
    } catch (const std::exception& e) {
        throw MongoSchemaException("insert_many", collectionName, _id.to_string());
    }
}

void MongoSchema::find_by_id(const bsoncxx::oid& id, const mongocxx::client& client) {
    try {
        auto collection = get_collection(client);
        auto filter = create_filter(R"({"_id": ")" + id.to_string() + R"("})");
        auto result = collection.find_one(filter);

        if( !result ) {
            throw NotFoundException(collectionName, _id.to_string(), "find_by_id");
        }

        // initializeSchema metodunu çağır ve classı doldur
        initializeSchema(result->view());
    } catch (const std::exception& e) {
        throw MongoSchemaException("find_by_id", collectionName, _id.to_string());
    }
}

void MongoSchema::find_one(const bsoncxx::v_noabi::document::view jsonFilter, const mongocxx::client& client) {
    try {
        auto collection = get_collection(client);
        auto result = collection.find_one(jsonFilter);

        if( !result ){
            throw NotFoundException(collectionName, _id.to_string(), "find_one");
        }

        initializeSchema(result->view());
    } catch (const std::exception& e) {
        throw MongoSchemaException("find_one", collectionName, _id.to_string());
    }
}

std::vector<bsoncxx::document::view> MongoSchema::find(const std::string& jsonFilter, const mongocxx::client& client) {
    try {
        auto collection = get_collection(client);
        auto filter = create_filter(jsonFilter);
        std::vector<bsoncxx::document::view> results;
        auto cursor = collection.find(filter);
        for (const auto& doc : cursor) {
            results.push_back(doc);
        }
        return results;
    } catch (const std::exception& e) {
        throw MongoSchemaException("find", collectionName, _id.to_string());
    }
}

void MongoSchema::update_one(const std::string& jsonFilter, const std::string& jsonUpdate, const mongocxx::client& client) {
    try {
        isValid();

        auto collection = get_collection(client);
        auto filter = create_filter(jsonFilter);
        auto update = bsoncxx::from_json(jsonUpdate);
        auto result = collection.update_one(filter, update.view());
        if (!result || result->modified_count() == 0) {
            throw MongoSchemaException("update_one", collectionName, _id.to_string());
        }
    } catch (const std::exception& e) {
        throw MongoSchemaException("update_one", collectionName, _id.to_string());
    }
}

void MongoSchema::update_many(const std::string& jsonFilter, const std::string& jsonUpdate, const mongocxx::client& client) {
    try {
        auto collection = get_collection(client);
        auto filter = create_filter(jsonFilter);
        auto update = bsoncxx::from_json(jsonUpdate);
        auto result = collection.update_many(filter, update.view());
        if (!result || result->modified_count() == 0) {
            throw MongoSchemaException("update_many", collectionName, _id.to_string());
        }
    } catch (const std::exception& e) {
        throw MongoSchemaException("update_many", collectionName, _id.to_string());
    }
}

void MongoSchema::delete_one(const std::string& jsonFilter, const mongocxx::client& client) {
    try {
        auto collection = get_collection(client);
        auto filter = create_filter(jsonFilter);
        auto result = collection.delete_one(filter);
        if (!result || result->deleted_count() == 0) {
            throw MongoSchemaException("delete_one", collectionName, _id.to_string());
        }
    } catch (const std::exception& e) {
        throw MongoSchemaException("delete_one", collectionName, _id.to_string());
    }
}

void MongoSchema::delete_many(const std::string& jsonFilter, const mongocxx::client& client) {
    try {
        auto collection = get_collection(client);
        auto filter = create_filter(jsonFilter);
        auto result = collection.delete_many(filter);
        if (!result || result->deleted_count() == 0) {
            throw MongoSchemaException("delete_many", collectionName, _id.to_string());
        }
    } catch (const std::exception& e) {
        throw MongoSchemaException("delete_many", collectionName, _id.to_string());
    }
}

bsoncxx::document::view MongoSchema::create_filter(const std::string& jsonFilter) {
    bsoncxx::document::value docValue = bsoncxx::from_json(jsonFilter);
    return docValue.view();
}
