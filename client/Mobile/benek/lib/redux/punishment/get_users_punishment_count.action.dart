import 'dart:developer';

import 'package:benek/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getUsersPunishmentCountRequestAction( String userId ) {
  return (Store<AppState> store) async {
    PunishmentApi api = PunishmentApi();

    try {

      int _usersPunishmentCount = await api.getUsersPunishmentCountRequest( userId );

      await store.dispatch(GetUsersPunishmentCountRequestAction(_usersPunishmentCount));

    } on ApiException catch (e) {
      log('ERROR: getUsersPunishmentCountRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetUsersPunishmentCountRequestAction {
  final int _usersPunishmentCount;
  int get usersPunishmentCount => _usersPunishmentCount;
  GetUsersPunishmentCountRequestAction(this._usersPunishmentCount);
}