import 'package:benek_kulube/data/models/kulube_login_qr_code_model.dart';
import 'package:benek_kulube/redux/admin_login_qr_code/admin_login_qr_code.action.dart';

dynamic setLoginCodeReducer(KulubeLoginQrCodeModel state, dynamic action) {
  if (action is GetAdminLoginQrCodeAction) {
    return action.qrCode;
  }

  return state;
}