import 'package:benek_kulube/common/utils/state_utils/login_qr_code_utils/redux/login_qr_code_actions.dart';

dynamic setLoginCodeReducer(dynamic state, dynamic action) {
  if (action is SetLoginCodeAction) {
    print( action.loginCodeData.qrCode );
    return state.copyWith(loginCodeData: action.loginCodeData);
  }

  return state;
}