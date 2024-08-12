#ifndef ENVHELPER_H
#define ENVHELPER_H

#include <string>
#include <unordered_map>

class EnvHelper {
public:
    // Singleton erişim yöntemi
    static EnvHelper& getInstance();

    // Çevre değişkenini almak için fonksiyon
    std::string getFromEnv(const std::string& key) const;

private:
    EnvHelper(); // Yapıcıyı özel yapın
    void loadEnvFile(const std::string& filepath);

    // Singleton örneği
    static EnvHelper instance;

    // Çevre değişkenlerini saklamak için harita
    std::unordered_map<std::string, std::string> envVars;
};

#endif // ENVHELPER_H
