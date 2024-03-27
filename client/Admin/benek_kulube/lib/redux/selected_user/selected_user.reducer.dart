import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserInfo? setSelectedUserReducer( UserInfo? userInfo, dynamic action ){
  if( action is SetSelectedUserAction ){
    return action.selectedUserInfo;
  }else if( action is GetUserInfoByUserIdAction ){
    return action.userData;
  }

  return userInfo;
}