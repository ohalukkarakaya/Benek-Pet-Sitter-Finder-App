// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/get_current_location_helper.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_search_result_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> userSearchRequestAction(String searchValue) {
  return (Store<AppState> store) async {
    UserSearchApi api = UserSearchApi();

    try {
      await LocationHelper.getCurrentLocation(store);

      double latitude = store.state.currentLocation!.latitude;
      double longitude = store.state.currentLocation!.longitude;

      bool isPagination = store.state.userSearchResultList != null 
                          && store.state.userSearchResultList!.users != null 
                          && store.state.userSearchResultList!.users!.isNotEmpty
                          && store.state.userSearchResultList!.searchValue == searchValue;

      String lastItemId = isPagination
                              ? store.state.userSearchResultList!.users!.last.userId!
                              : "null";

      UserSearchResult _searchListData = await api.postUserSearchRequest( lastItemId, searchValue, latitude, longitude );
      if( isPagination ){
        store.state.userSearchResultList!.addNewPage(_searchListData);
      } else {
        await store.dispatch(UserSearchRequestAction(_searchListData));
      }

    } on ApiException catch (e) {
      log('ERROR: userSearchRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class UserSearchRequestAction {
  final UserSearchResult? _searchListData;
  UserSearchResult? get searchListData => _searchListData;
  UserSearchRequestAction(this._searchListData);
}