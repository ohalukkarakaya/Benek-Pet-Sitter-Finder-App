import 'dart:developer';

import 'package:benek_kulube/data/models/chat_models/punishment_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getUsersPunishmentDataAction( String userId ) {
  return (Store<AppState> store) async {
    PunishmentApi api = PunishmentApi();

    try {

      List<PunishmentModel> _usersPunishmentData = await api.getUsersPunishmentData( userId );

      await store.dispatch(GetUsersPunishmentDataAction(_usersPunishmentData));

    } on ApiException catch (e) {
      log('ERROR: getUsersPunishmentDataAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetUsersPunishmentDataAction {
  final List<PunishmentModel> _usersPunishmentData;
  List<PunishmentModel> get usersPunishmentData => _usersPunishmentData;
  GetUsersPunishmentDataAction(this._usersPunishmentData);
}