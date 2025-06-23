import 'dart:developer';

import 'package:benek/common/utils/shared_preferences_helper.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<Map<String, dynamic>> loginAction(String email, String password, String clientId) async {
  AuthApi api = AuthApi();

  try {
    dynamic _data = await api.postLoginRequest(email, password, clientId);
    
    if (_data['error'] == true || (_data['isVerifiyingEmail'] != null && _data['isVerifiyingEmail']) ) {
      return {
        'success': false,
        'shouldVerifyEmail': _data['isVerifiyingEmail'] ?? false,
        'message': _data['message'] ?? 'Giriş yapılamadı'
      };
    }

    String _refreshTokenToken = _data['refreshToken'];

    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(SharedPreferencesKeys.refreshToken, _refreshTokenToken);

    return {
      'success': true,
      'shouldVerifyEmail': false
    };
  } catch (e) {
    log('ERROR: loginAction - $e');
    return {
      'success': false,
      'message': 'Bilinmeyen hata oluştu.',
      'shouldVerifyEmail': false
    };
  }
}
