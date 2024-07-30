// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/get_current_location_helper.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getRecomendedUsersRequestAction( bool isPagination ) {
  return (Store<AppState> store) async {
    RecomendedUsersApi api = RecomendedUsersApi();

    try {
      if( store.state.currentLocation == null ) {
        await LocationHelper.getCurrentLocation(store);
      }

      double latitude = store.state.currentLocation!.latitude;
      double longitude = store.state.currentLocation!.longitude;

      String lastItemId = isPagination
                              ? store.state.recomendedUsersList!.users!.last.userId!
                              : "null";

      UserList _dataList = await api.postRecomendedUsersRequest( lastItemId, latitude, longitude );
      if( isPagination ){
        store.state.recomendedUsersList!.addNewPage(_dataList);
        _dataList = store.state.recomendedUsersList!;
      }

      _dataList.recentlySeenUsers = store.state.recomendedUsersList?.recentlySeenUsers;

      await store.dispatch(GetRecomendedUsersRequestAction(_dataList));
      
    } on ApiException catch (e) {
      log('ERROR: userSearchRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetRecomendedUsersRequestAction {
  final UserList? _dataList;
  UserList? get dataList => _dataList;
  GetRecomendedUsersRequestAction(this._dataList);
}