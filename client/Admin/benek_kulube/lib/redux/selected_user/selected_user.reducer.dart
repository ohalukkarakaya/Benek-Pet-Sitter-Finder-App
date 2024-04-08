import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserInfo? setSelectedUserReducer( UserInfo? userInfo, dynamic action ){
  if( action is SetSelectedUserAction ){
    return action.selectedUserInfo;
  }else if( action is GetUserInfoByUserIdAction ){
    return action.userData;
  }else if( action is GetPetsByUserIdRequestAction ){
    userInfo!.addPets(action.pets!);
    return userInfo;
  }else if( action is InitPastCareGiversAction ){
    userInfo!.addPastCareGivers(action.pastCareGiversList!);
    return userInfo;
  }else if( action is InitCareGiveDataAction ){
    userInfo!.addCareGiveCareer(action.careGiveList!);
    return userInfo;
  }

  return userInfo;
}