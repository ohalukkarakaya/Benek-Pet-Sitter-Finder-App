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

ThunkAction<AppState> userSearchRequestAction(String searchValue, bool isPagination) {
  return (Store<AppState> store) async {
    UserSearchApi api = UserSearchApi();

    try {
      if( store.state.currentLocation == null ) {
        await LocationHelper.getCurrentLocation(store);
      }

      double latitude = store.state.currentLocation!.latitude;
      double longitude = store.state.currentLocation!.longitude;

      String lastItemId = isPagination
                              ? store.state.userSearchResultList!.users!.last.userId!
                              : "null";

      UserList _searchListData = await api.postUserSearchRequest( lastItemId, searchValue, latitude, longitude );
      if( isPagination &&   store.state.userSearchResultList != null){
        store.state.userSearchResultList?.addNewPage(_searchListData);
        _searchListData = store.state.userSearchResultList!;
      }
      await store.dispatch(UserSearchRequestAction(_searchListData));

    } on ApiException catch (e) {
      log('ERROR: userSearchRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> resetUserSearchDataAction() {
  return (Store<AppState> store) async {
    try {
      UserList? _resetData;
      _resetData?.recentlySeenUsers = store.state.userSearchResultList?.recentlySeenUsers;

      await store.dispatch(UserSearchRequestAction(_resetData));
    } on ApiException catch (e) {
      log('ERROR: resetUserSearchDataAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class UserSearchRequestAction {
  final UserList? _searchListData;
  UserList? get searchListData => _searchListData;
  UserSearchRequestAction(this._searchListData);
}