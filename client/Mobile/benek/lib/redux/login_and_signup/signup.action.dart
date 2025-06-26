import 'dart:developer';

import 'package:benek/common/widgets/login_screen_widgets/gender_selector_widget.dart';
import 'package:benek/data/services/api.dart';

Future<Map<String, dynamic>> signUpAction(
      String username, 
      String email, 
      Gender gender, 
      String firstname, 
      String lastname,
      String city,
      String lat,
      String lng,
      String password, 
      String clientId,
      String? middlename
) async {
  AuthApi api = AuthApi();

  try {
    dynamic _data = await api.postSignupRequest(
      username,
      email,
      gender,
      firstname,
      lastname,
      city,
      lat,
      lng,
      password,
      clientId,
      middlename
    );
    
    if (_data['error'] == true) {
      return {
        'success': false,
        'message': _data['message'] ?? 'Üye olunamadı'
      };
    }

    return {
      'success': true,
      'message': _data['message'] ?? 'Üye olundu'
    };
  } catch (e) {
    log('ERROR: signUpAction - $e');
    return {
      'success': false,
      'message': 'Bilinmeyen hata oluştu.',
    };
  }
}
