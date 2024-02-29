import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserInfo? setSelectedUserReducer( UserInfo? userInfo, dynamic action ){
  if( action is SetSelectedUserAction ){
    return action.selectedUserInfo;
  }

  return userInfo;
}