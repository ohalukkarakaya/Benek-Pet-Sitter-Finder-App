part of benek.api;

class AuthApi {

  final ApiClient apiClient;

  AuthApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<dynamic> getAccessTokenAndRoleIdRequest() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      const String path = '/api/refreshToken';

      Object postBody = jsonEncode({ 'refreshToken': store.state.userRefreshToken });

      final response = await http.post( 
        Uri.parse("${AppConfig.baseUrl}$path"), 
        body: postBody,
        headers: {'Content-Type': 'application/json'},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if( data['error'] == false ){
        String accessToken = data['accessToken'];
        int userRole = data['role'];

        return { accessToken, userRole };
      }else{
        await AuthUtils.killUserSessionAndNavigate( store );
      }

    } catch (e) {
      log('ERROR: getAccessToken - $e');
    }
  }
}