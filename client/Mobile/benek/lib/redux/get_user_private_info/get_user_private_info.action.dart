// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/data/models/user_profile_models/private_info_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getUsersPrivateInfoRequestAction() {
  return (Store<AppState> store) async {
    UserPrivateInfoApi api = UserPrivateInfoApi();

    try {
      PrivateInfoModel _userPrivateInfo = await api.getUsersPrivateInfoRequest();

      await store.dispatch(GetUsersPrivateInfoRequestAction(_userPrivateInfo));
    } on ApiException catch (e) {
      log('ERROR: getUsersPrivateInfoRequestAction - $e');
    }
  };
}

class GetUsersPrivateInfoRequestAction {
  final PrivateInfoModel? _userPrivateInfo;
  PrivateInfoModel? get userPrivateInfo => _userPrivateInfo;
  GetUsersPrivateInfoRequestAction(this._userPrivateInfo);
}