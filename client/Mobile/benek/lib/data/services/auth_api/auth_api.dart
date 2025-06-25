part of '../api.dart';

class AuthApi {
  final ApiClient apiClient;

  AuthApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<dynamic> getAccessTokenAndRoleIdRequest() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try {
      const String path = '/api/refreshToken';

      Object postBody =
          jsonEncode({'refreshToken': store.state.userRefreshToken});

      final response = await http.post(
        Uri.parse("${AppConfig.baseUrl}$path"),
        body: postBody,
        headers: {'Content-Type': 'application/json'},
      );

      final data = jsonDecode(response.body);

      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (data['error'] == false) {
        String accessToken = data['accessToken'];
        int userRole = data['role'];

        return {accessToken, userRole};
      } else {
        await AuthUtils.killUserSessionAndRestartApp(store);
      }
    } catch (e) {
      log('ERROR: getAccessToken - $e');
    }
  }

  Future<dynamic> postLoginRequest(String email, String password, String clientId) async {
    try {
      const String path = '/auth/login';

      Object postBody =
          jsonEncode({'email': email, 'password': password, 'ip': clientId});

      final response = await http.post(
        Uri.parse("${AppConfig.baseUrl}$path"),
        body: postBody,
        headers: {'Content-Type': 'application/json'},
      );
      final data = jsonDecode(response.body);
      if (response.statusCode >= 400 && response.statusCode != 401) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (response.statusCode == 401 && ((data['isEmailVerified'] != null && !(data['isEmailVerified']) || data['isLoggedInIpTrusted'] != null && !(data['isLoggedInIpTrusted']) ) )) {
        String? refreshtoken;
        String? accessToken;
        int? userRole;

        return {
          'error': false,
          "isVerifiyingEmail": true,
          'refreshToken': refreshtoken,
          'accessToken': accessToken,
          'userRole': userRole
        };
      } else if (data['error'] == false) {
        String? refreshtoken = data['refreshToken'];
        String? accessToken = data['accessToken'];
        int? userRole = data['roleId'];

        print( refreshtoken );

        return {
          'error': false,
          "isVerifiyingEmail": false,
          'refreshToken': refreshtoken,
          'accessToken': accessToken,
          'userRole': userRole
        };

      } else {
        return {
          'error': true,
          'message': data['message'],
          'isVerifiyingEmail': data['isVerifiyingEmail'] ?? false
        };
      }
    } catch (e) {
      log('ERROR: postLoginRequest - $e');
    }
  }
}
