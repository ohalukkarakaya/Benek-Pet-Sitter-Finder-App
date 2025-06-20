// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/data/models/user_profile_models/private_info_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> setUserAuthRoleRequestAction( String userId, String roleId ) {
  return (Store<AppState> store) async {
    UserSetAuthRoleApi api = UserSetAuthRoleApi();

    try {
      bool _isRequestSuccessful = await api.putSetUserAuthRoleRequest( userId, roleId );

      if( _isRequestSuccessful ) {
        await store.dispatch(SetUserAuthRoleRequestAction(userId, roleId));
      }
    } on ApiException catch (e) {
      log('ERROR: setUserAuthRoleRequestAction - $e');
    }
  };
}

class SetUserAuthRoleRequestAction {
  final String? _userId;
  final String? _roleId;

  String? get userId => _userId;
  String get roleId => _roleId!;

  SetUserAuthRoleRequestAction(this._userId, this._roleId);
}