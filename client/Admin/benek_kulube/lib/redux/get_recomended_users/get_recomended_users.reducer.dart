import 'package:benek_kulube/data/models/user_profile_models/user_search_result_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserSearchResult? userSearchRequestReducer( UserSearchResult? recomendedUsers, dynamic action ){
  if( action is GetRecomendedUsersRequestAction ){
    return action.dataList;
  }

  return recomendedUsers;
}