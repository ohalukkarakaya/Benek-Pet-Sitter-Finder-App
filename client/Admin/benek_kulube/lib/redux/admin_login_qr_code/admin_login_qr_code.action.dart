import 'dart:developer';

import 'package:benek_kulube/data/models/kulube_login_qr_code_model.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/services/api.dart';

ThunkAction<AppState> getAdminLoginQrCodeAction( String clientId ) {
  return (Store<AppState> store) async {
    AdminLoginQrCodeApi api = AdminLoginQrCodeApi();

    try {
      KulubeLoginQrCodeModel _qrCode = await api.getAdminLoginQrCodeRequest(clientId);
      
      await store.dispatch(GetAdminLoginQrCodeAction(_qrCode));
    } on ApiException catch (e) {
      log('ERROR: getAdminLoginQrCodeAction - $e');
    }
  };
}

class GetAdminLoginQrCodeAction {
  final KulubeLoginQrCodeModel _qrCode;
  KulubeLoginQrCodeModel get qrCode => _qrCode;
  GetAdminLoginQrCodeAction(this._qrCode);
}