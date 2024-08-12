#include "EnvHelper.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <iostream> // Hata ayıklama için ekleme

// Singleton örneğini başlat
EnvHelper EnvHelper::instance;

// Yapıcı
EnvHelper::EnvHelper() {
    try {
        std::cout << "Loading .env file..." << std::endl;

        std::filesystem::path currentPath = std::filesystem::current_path();
        std::filesystem::path envPath = currentPath / "../.env";

        // Yolun doğru olduğundan emin olun
        if (!std::filesystem::exists(envPath)) {
            std::cerr << "Env file does not exist at: " << envPath << std::endl;
        }

        EnvHelper::getInstance().loadEnvFile(envPath.string());
        std::cout << ".env file loaded successfully." << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error during initialization: " << e.what() << std::endl;
    }
}

// .env dosyasını yükle
void EnvHelper::loadEnvFile(const std::string& filepath) {
    std::ifstream file(filepath);
    if (!file.is_open()) {
        throw std::runtime_error("Could not open .env file: " + filepath);
    }

    std::string line;
    while (std::getline(file, line)) {

        if (line.empty()) {
            continue;
        }

        std::istringstream iss(line);
        std::string key, value;
        if (std::getline(std::getline(iss, key, '=') >> std::ws, value)) {
            envVars[key] = value;
        } else {
            std::cerr << "Warning: Invalid line format in .env file: " << line << std::endl;
        }
    }

    if (file.bad()) {
        throw std::runtime_error("Error reading .env file: " + filepath);
    }
}

// Singleton erişim yöntemi
EnvHelper& EnvHelper::getInstance() {
    return instance;
}

// Çevre değişkenini almak için fonksiyon
std::string EnvHelper::getFromEnv(const std::string& key) const {
    auto it = envVars.find(key);
    if (it != envVars.end()) {
        return it->second;
    }
    return "";
}