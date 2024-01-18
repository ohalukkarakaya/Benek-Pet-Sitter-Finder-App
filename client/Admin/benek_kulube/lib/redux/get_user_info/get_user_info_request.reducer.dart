import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/redux/get_user_info/get_user_info_request.action.dart';

UserInfo? getUserInfoRequestReducer( UserInfo? userInfo, dynamic action ){
  if( action is GetUserInfoRequestAction ){
    return action.userInfo;
  }

  return userInfo;
}