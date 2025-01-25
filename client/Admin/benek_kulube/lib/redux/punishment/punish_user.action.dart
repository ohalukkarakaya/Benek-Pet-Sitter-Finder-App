import 'dart:developer';

import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/chat_models/punishment_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> punishUserAction( String userId, String punishmentDesc ) {
  return (Store<AppState> store) async {
    PunishmentApi api = PunishmentApi();
    try {

      bool didUserBanned = await api.punishUserRequest( userId, punishmentDesc );
      await store.dispatch(PunishUserAction(didUserBanned));

    } on ApiException catch (e) {
      log('ERROR: userSearchRequestAction - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class PunishUserAction {
  final bool? _didUserBanned;
  get didUserBanned => _didUserBanned;
  PunishUserAction(this._didUserBanned);
}