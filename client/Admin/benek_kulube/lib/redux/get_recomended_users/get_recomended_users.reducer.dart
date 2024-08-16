import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

UserList? userSearchRequestReducer( UserList? recomendedUsers, dynamic action ){
  if( action is GetRecomendedUsersRequestAction ){
    return action.dataList;
  }else if( action is SetRecentlySeenUserAction ){
    recomendedUsers?.addNewSeenUser( action.userInfo );
    return recomendedUsers;
  }else if( action is UpdateProfileImageRequestAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).profileImg = action.userProfileImage;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).profileImg = action.userProfileImage;
      }
    }

    return recomendedUsers;
  }else if( action is UpdateBioRequestAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.bio = action.newBio;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).identity?.bio = action.newBio;
      }
    }
  }else if( action is UpdateAddressRequestAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.openAdress = action.newOpenAddress;
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).location = action.newLocation;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).identity?.openAdress = action.newOpenAddress;

        recomendedUsers.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).location = action.newLocation;
      }
    }
  } else if( action is UpdateFullNameRequestAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.firstName = action.firstName;
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.middleName = action.middleName;
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.lastName = action.lastName;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).identity?.firstName = action.firstName;
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).identity?.middleName = action.middleName;
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).identity?.lastName = action.lastName;
      }
    }
  }else if( action is UpdateEmailAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).email = action.email;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).email = action.email;
      }
    }

    return recomendedUsers;
  }

  return recomendedUsers;
}