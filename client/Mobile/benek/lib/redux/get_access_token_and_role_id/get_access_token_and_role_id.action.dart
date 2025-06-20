// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getAccessTokenAndRoleIdRequestAction() {
  return (Store<AppState> store) async {
    AuthApi api = AuthApi();

    try {
      dynamic _accessTokenAndRoleId = await api.getAccessTokenAndRoleIdRequest();
      String _accessToken = _accessTokenAndRoleId.elementAt(0);
      int userRole = _accessTokenAndRoleId.elementAt(1);
      
      await store.dispatch(SetAccessTokenAction(_accessToken));
      await store.dispatch(SetRoleIdAction(userRole));
    } on ApiException catch (e) {
      log('ERROR: getUserInfoRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class SetAccessTokenAction {
  final String _accessToken;
  String get accessToken => _accessToken;
  SetAccessTokenAction(this._accessToken);
}

class SetRoleIdAction {
  final int _userRoleId;
  int get userRoleId => _userRoleId;
  SetRoleIdAction(this._userRoleId);
}