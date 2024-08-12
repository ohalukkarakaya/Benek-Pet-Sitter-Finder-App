cmake_minimum_required(VERSION 3.5)
project(benek_server CXX)

include(CheckIncludeFileCXX)

check_include_file_cxx(any HAS_ANY)
check_include_file_cxx(string_view HAS_STRING_VIEW)
check_include_file_cxx(coroutine HAS_COROUTINE)

if (NOT "${CMAKE_CXX_STANDARD}" STREQUAL "")
    # Do nothing
elseif (HAS_ANY AND HAS_STRING_VIEW AND HAS_COROUTINE)
    set(CMAKE_CXX_STANDARD 20)
elseif (HAS_ANY AND HAS_STRING_VIEW)
    set(CMAKE_CXX_STANDARD 17)
else ()
    set(CMAKE_CXX_STANDARD 14)
endif ()

set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

file(GLOB_RECURSE HEADER_FILES "include/*.h" "exceptions/*.h" "middleware/*.h" "controllers/*.h" "models/*.h" "constants/*.h")
file(GLOB_RECURSE SOURCE_FILES "include/*.cpp" "exceptions/*.cpp" "middleware/*.cpp" "controllers/*.cpp" "models/*.cpp" "constants/*.cpp")

add_executable(
        ${PROJECT_NAME} main.cc
        include/mongo_db_helper/MongoDBHelper.h
        include/mongo_db_helper/MongoDBHelper.cpp
        include/env_helper/EnvHelper.h
        include/env_helper/EnvHelper.cpp
        .env
        include/mongo_db_connection_pool/MongoDbConnectionPool.h
        include/mongo_db_connection_pool/MongoDbConnectionPool.cpp
        include/jwt_verifier/JwtVerifier.h
        include/jwt_verifier/JwtVerifier.cpp
        include/jwt_creater/JwtCreater.h
        include/jwt_creater/JwtCreater.cpp
        middleware/auth_middleware/AuthMiddleware.h
        middleware/auth_middleware/AuthMiddleware.cpp
        controllers/auth_token_controller/AuthToken.h
        models/UserTokenSchema/UserTokenSchema.h
        models/UserTokenSchema/UserTokenSchema.cpp
        models/MongoSchema/MongoSchema.h
        models/MongoSchema/MongoSchema.cpp
        exceptions/MongoSchemaException/MongoSchemaException.h
        exceptions/MongoSchemaException/MongoSchemaException.cpp
        exceptions/MongoValidationException/MongoValidationException.h
        exceptions/MongoValidationException/MongoValidationException.cpp
        constants/ErrorMessages.h
        controllers/auth_token_controller/get_new_access_token_handler.cpp
        controllers/auth_token_controller/logout_handler.cpp
        exceptions/NotFoundException/NotFoundException.h
        exceptions/NotFoundException/NotFoundException.cpp
        models/UserSchema/UserSchema.h
        models/UserSchema/UserSchema.cpp
        models/UserIdentityModel/UserIdentityModel.h
        models/UserNationalIdModel/UserNationalIdModel.cpp
        models/UserNationalIdModel/UserNationalIdModel.h
        models/UserLocationModel/UserLocationModel.h
        models/CardGuidModel/CardGuidModel.h
        models/UserProfileImageModel/UserProfileImageModel.h
        models/UserStarModel/UserStarModel.h
        models/TagModel/TagModel.h
        models/DeactivationModel/DeactivationModel.h
        models/UserIdentityModel/UserIdentityModel.cpp
        models/UserLocationModel/UserLocationModel.cpp
        models/CardGuidModel/CardGuidModel.cpp
        models/UserProfileImageModel/UserProfileImageModel.cpp
        models/UserStarModel/UserStarModel.cpp
        models/TagModel/TagModel.cpp
        models/DeactivationModel/DeactivationModel.cpp
)

# ##############################################################################
# If you include the drogon source code locally in your project, use this method
# to add drogon
# add_subdirectory(drogon)
# target_link_libraries(${PROJECT_NAME} PRIVATE drogon)
#
# and comment out the following lines
find_package(Drogon CONFIG REQUIRED)

# Specify the directory for libmongocxx and libbsoncxx
set(libmongocxx_DIR "/usr/local/opt/mongo-cxx-driver/3.10.2/lib/cmake/mongocxx-3.10.2")
set(libbsoncxx_DIR "/usr/local/opt/mongo-cxx-driver/3.10.2/lib/cmake/bsoncxx-3.10.2")

find_package(mongocxx REQUIRED)
find_package(bsoncxx REQUIRED)
find_package(OpenSSL REQUIRED)

# Include directories for mongocxx and bsoncxx
include_directories(${LIBMONGOCXX_INCLUDE_DIRS})
include_directories(${LIBBSONCXX_INCLUDE_DIRS})

# Include the v_noabi directory specifically
include_directories("/usr/local/opt/mongo-cxx-driver/3.10.2/include/mongocxx/v_noabi")
include_directories("/usr/local/opt/mongo-cxx-driver//include/mongocxx/v_noabi")
include_directories("/usr/local/opt/mongo-cxx-driver/3.10.2/include/bsoncxx/v_noabi")
include_directories("/usr/local/opt/mongo-cxx-driver//include/bsoncxx/v_noabi")
include_directories("/usr/local/opt/mongo-c-driver/1.27.4/include/libmongoc-1.0")
include_directories("/usr/local/opt/mongo-c-driver/1.27.4/include/libbson-1.0")
include_directories("/usr/local/opt/mongo-c-driver/1.27.4/lib")
include_directories(${OPENSSL_INCLUDE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/include/jwt-cpp)

target_link_libraries(${PROJECT_NAME}
        PRIVATE
        Drogon::Drogon
        ${LIBMONGOCXX_LIBRARIES}
        ${LIBBSONCXX_LIBRARIES}
        ${OPENSSL_LIBRARIES}
        /usr/local/lib/libmongocxx.dylib
        /usr/local/lib/libbsoncxx.dylib
)

# ##############################################################################

if (CMAKE_CXX_STANDARD LESS 17)
    message(FATAL_ERROR "C++17 or higher is required")
elseif (CMAKE_CXX_STANDARD LESS 20)
    message(STATUS "Use C++17")
else ()
    message(STATUS "Use C++20")
endif ()

aux_source_directory(controllers CTL_SRC)
aux_source_directory(filters FILTER_SRC)
aux_source_directory(plugins PLUGIN_SRC)
aux_source_directory(models MODEL_SRC)

drogon_create_views(${PROJECT_NAME} ${CMAKE_CURRENT_SOURCE_DIR}/views ${CMAKE_CURRENT_BINARY_DIR})
# use the following line to create views with namespaces.
# drogon_create_views(${PROJECT_NAME} ${CMAKE_CURRENT_SOURCE_DIR}/views ${CMAKE_CURRENT_BINARY_DIR} TRUE)
# use the following line to create views with namespace CHANGE_ME prefixed and path namespaces.
# drogon_create_views(${PROJECT_NAME} ${CMAKE_CURRENT_SOURCE_DIR}/views ${CMAKE_CURRENT_BINARY_DIR} TRUE CHANGE_ME)

target_include_directories(${PROJECT_NAME}
        PRIVATE
        ${CMAKE_CURRENT_SOURCE_DIR}
        ${CMAKE_CURRENT_SOURCE_DIR}/models
)

target_sources(${PROJECT_NAME}
        PRIVATE
        ${CTL_SRC}
        ${FILTER_SRC}
        ${PLUGIN_SRC}
        ${MODEL_SRC}
)

# ##############################################################################
# Uncomment the following line for dynamically loading views
# set_property(TARGET ${PROJECT_NAME} PROPERTY ENABLE_EXPORTS ON)

# ##############################################################################

add_subdirectory(test)