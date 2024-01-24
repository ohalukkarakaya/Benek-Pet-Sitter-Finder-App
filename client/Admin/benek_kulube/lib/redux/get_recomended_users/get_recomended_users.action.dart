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

ThunkAction<AppState> getRecomendedUsersRequestAction( bool isPagination ) {
  return (Store<AppState> store) async {
    RecomendedUsersApi api = RecomendedUsersApi();

    try {
      await LocationHelper.getCurrentLocation( store );

      double latitude = store.state.currentLocation!.latitude;
      double longitude = store.state.currentLocation!.longitude;

      String lastItemId = isPagination
                              ? store.state.userSearchemptyStateList!.users!.last.userId!
                              : "null";

      UserSearchResult _dataList = await api.postUserSearchRequest( lastItemId, latitude, longitude );
      if( isPagination ){
        store.state.userSearchemptyStateList!.addNewPage(_dataList);
        _dataList = store.state.userSearchemptyStateList!;
      } 
      await store.dispatch(GetRecomendedUsersRequestAction(_dataList));
      
    } on ApiException catch (e) {
      log('ERROR: userSearchRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

class GetRecomendedUsersRequestAction {
  final UserSearchResult? _dataList;
  UserSearchResult? get dataList => _dataList;
  GetRecomendedUsersRequestAction(this._dataList);
}