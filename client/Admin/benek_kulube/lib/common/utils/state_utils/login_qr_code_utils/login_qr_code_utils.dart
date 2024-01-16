import 'dart:convert';
import 'dart:developer';

import 'package:benek_kulube/common/constants/app_config.dart';
import 'package:benek_kulube/common/utils/state_utils/login_qr_code_utils/redux/login_qr_code_actions.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:http/http.dart' as http;
import 'package:redux/redux.dart';

import '../../../../data/models/kulube_login_qr_code_model.dart';

// Get Access Token
Future<void> getLoginQrCode(Store<AppState> store, String clientId ) async {
  try {

      final response = await http.get(
        Uri.parse("${AppConfig.baseUrl}/api/admin/getLoginQrCode/$clientId"),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data['error'] == false) { 

          DateTime now = DateTime.now();
          DateTime expiration = now.add(const Duration(minutes: 60));

          String qrCode = data['code'];
          String clientId = data['clientId'];
          KulubeLoginQrCodeModel loginCodeData = KulubeLoginQrCodeModel(
            qrCode: qrCode,
            clientId: clientId,
            expireTime: expiration
          );

          await store.dispatch(SetLoginCodeAction(loginCodeData));
        }else{
          log('ERROR: getLoginQrCode - ${data['error']}');
        }
      }else{
        log('ERROR: getLoginQrCode - ${response.statusCode}');
      }
    } catch (e) {
      log('ERROR: getLoginQrCode - $e');
    }
}