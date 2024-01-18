part of benek.api;

class AdminLoginQrCodeApi {

  final ApiClient apiClient;

  AdminLoginQrCodeApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<dynamic> getAdminLoginQrCodeRequest( String clientId ) async {
    try{
      String path = '/api/admin/getLoginQrCode/$clientId';

      final response = await http.get( 
        Uri.parse("${AppConfig.baseUrl}$path"), 
        headers: {'Content-Type': 'application/json'},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if( data['error'] == false ){
        DateTime now = DateTime.now();
        DateTime expiration = now.add(const Duration(minutes: 60));

        String qrCode = data['code'];
        String clientId = data['clientId'];

        KulubeLoginQrCodeModel loginCodeData = KulubeLoginQrCodeModel(
          qrCode: qrCode,
          clientId: clientId,
          expireTime: expiration
        );

        return loginCodeData;
      }else{
        log('ERROR: getAdminLoginQrCodeRequest - ${response.statusCode}');
      }

    } catch (e) {
      log('ERROR: getAccessToken - $e');
    }
  }
}