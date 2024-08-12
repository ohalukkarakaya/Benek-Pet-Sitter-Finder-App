#include <drogon/drogon.h>

int main() {
    drogon::app().addListener("0.0.0.0", 5555);

//    drogon::app().registerHandler("/test",
//      [](const drogon::HttpRequestPtr& req, std::function<void(const drogon::HttpResponsePtr&)>&& callback) {
//          try {
//
//              auto db = MongoDBHelper::getInstance().getDatabase("benek");
//              auto collection = db["users"];
//
//              auto cursor = collection.find({});
//
//              Json::Value jsonResponse;
//              jsonResponse["usernames"] = Json::arrayValue;
//
//              for (const auto& doc : cursor) {
//                  if (doc["userName"]) {
//                      jsonResponse["usernames"].append(doc["userName"].get_string().value.to_string());
//                  }
//              }
//
//              auto response = drogon::HttpResponse::newHttpJsonResponse(jsonResponse);
//              callback(response);
//          } catch (const std::exception& e) {
//              Json::Value errorResponse;
//              errorResponse["error"] = e.what();
//              auto response = drogon::HttpResponse::newHttpJsonResponse(errorResponse);
//              callback(response);
//          }
//      });

    drogon::app().run();

    return 0;
}
