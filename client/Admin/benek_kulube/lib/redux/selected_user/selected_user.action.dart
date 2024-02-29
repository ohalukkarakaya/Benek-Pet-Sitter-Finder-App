// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> setSelectedUserAction( UserInfo? selectedUserInfo ){
  return (Store<AppState> store) async {
    try {
      await store.dispatch(SetSelectedUserAction(selectedUserInfo));
    } on ApiException catch (e) {
      log('ERROR: setSelectedUserAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class SetSelectedUserAction {
  final UserInfo? _selectedUserInfo;
  UserInfo? get selectedUserInfo => _selectedUserInfo;
  SetSelectedUserAction(this._selectedUserInfo);
}