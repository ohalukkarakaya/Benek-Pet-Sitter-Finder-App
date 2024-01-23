import 'package:benek_kulube/data/models/user_profile_models/user_search_result_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserSearchResult? userSearchRequestReducer( UserSearchResult? userSearchListData, dynamic action ){
  if( action is UserSearchRequestAction ){
    return action.searchListData;
  }

  return userSearchListData;
}