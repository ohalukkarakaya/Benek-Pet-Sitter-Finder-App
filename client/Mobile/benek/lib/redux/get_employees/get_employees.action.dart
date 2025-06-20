import 'dart:developer';

import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import 'package:benek/data/models/user_profile_models/user_info_model.dart';

import '../../data/models/user_profile_models/user_list_model.dart';
import '../../data/services/custom_exception.dart';

ThunkAction<AppState> getEmployeesAction( bool isPagination ) {
  return (Store<AppState> store) async {
    UserSetAuthRoleApi userSetAuthRoleApi = UserSetAuthRoleApi();
    try {
      String lastItemId = isPagination
          ? store.state.employees!.users!.last.userId!
          : "null";

      UserList? response = await userSetAuthRoleApi.getEmployeesRequest( lastItemId );


      if( isPagination && response != null ){
        store.state.employees?.addNewPage(response!);
        response = store.state.employees!;
      }

      if (response != null && response.users != null && response.users!.isNotEmpty) {
        store.dispatch(GetEmployeesRequestAction(response));
      }
    } on ApiException catch (e) {
      log('API Error: ${e.message}');
    } on CustomException catch (e) {
      log('Custom Error: ${e.message}');
    } catch (e) {
      log('Unknown Error: $e');
    }
  };
}


ThunkAction<AppState> resetEmployeesAction( ) {
  return (Store<AppState> store) async {
    store.dispatch(GetEmployeesRequestAction(null));
  };
}

class GetEmployeesRequestAction {
  final UserList? _dataList;
  UserList? get dataList => _dataList;
  GetEmployeesRequestAction(this._dataList);
}