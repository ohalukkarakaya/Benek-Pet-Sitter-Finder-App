// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getUserInfoByUserIdAction(String userId){
  return (Store<AppState> store) async {
    UserInfoByUserIdApi api = UserInfoByUserIdApi();

    try {

      UserInfo _data = await api.getUserInfoByUserIdRequest( userId );
      await store.dispatch(GetUserInfoByUserIdAction(_data));

    } on ApiException catch (e) {
      log('ERROR: getUserInfoByUserIdAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class  GetUserInfoByUserIdAction{
  final UserInfo? _data;
  UserInfo? get userData => _data;
  GetUserInfoByUserIdAction(this._data);
}