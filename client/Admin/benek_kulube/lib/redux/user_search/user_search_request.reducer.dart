import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserList? userSearchRequestReducer( UserList? userSearchListData, dynamic action ){
  if( action is UserSearchRequestAction ){
    return action.searchListData;
  }else if( action is SetRecentlySeenUserAction ){
    userSearchListData?.addNewSeenUser( action.userInfo );
    return userSearchListData;
  }else if( action is UpdateProfileImageRequestAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).profileImg = action.userProfileImage;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).profileImg = action.userProfileImage;
      }
    }

    return userSearchListData;
  }else if( action is UpdateBioRequestAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.bio = action.newBio;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).identity?.bio = action.newBio;
      }
    }

    return userSearchListData;
  }

  return userSearchListData;
}