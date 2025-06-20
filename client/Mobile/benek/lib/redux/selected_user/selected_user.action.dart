// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek/data/services/api_exception.dart';
import 'package:benek/redux/get_stories_by_user_id/get_stories_by_user_id.action.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import 'package:benek/data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> setSelectedUserAction( UserInfo? selectedUserInfo ){
  return (Store<AppState> store) async {
    try {
      await store.dispatch(setStoriesAction(null));
      await store.dispatch(SetSelectedUserAction(selectedUserInfo));
    } on ApiException catch (e) {
      log('ERROR: setSelectedUserAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> removeUserAction( String? userId ){
  return (Store<AppState> store) async {
    try {
      await store.dispatch(RemoveUserAction(userId));
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

class RemoveUserAction {
  final String? _userId;
  String? get userId => _userId;
  RemoveUserAction(this._userId);
}