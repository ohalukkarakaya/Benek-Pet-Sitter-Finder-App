// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> getUserInfoRequestAction() {
  return (Store<AppState> store) async {
    UserInfoApi api = UserInfoApi();

    try {
      UserInfo _userInfo = await api.getUserInfoRequest();
      
      await store.dispatch(GetUserInfoRequestAction(_userInfo));
    } on ApiException catch (e) {
      log('ERROR: getUserInfoRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetUserInfoRequestAction {
  final UserInfo? _userInfo;
  UserInfo? get userInfo => _userInfo;
  GetUserInfoRequestAction(this._userInfo);
}