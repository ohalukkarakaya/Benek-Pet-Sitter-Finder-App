import 'package:benek/data/models/user_profile_models/user_list_model.dart';
import 'package:benek/store/actions/app_actions.dart';

UserList? userSearchRequestReducer( UserList? recomendedUsers, dynamic action ){
  if( action is GetRecomendedUsersRequestAction ){
    return action.dataList;
  }else if( action is SetRecentlySeenUserAction ){
    recomendedUsers?.addNewSeenUser( action.userInfo );
    return recomendedUsers;
  }else if( action is RemoveUserAction ){
    recomendedUsers?.removeUser( action.userId );
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
  } else if( action is BecomeCareGiverAction ) {
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).isCareGiver = true;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).isCareGiver = true;
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
  }else if( action is UpdateUserNameAction ) {
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).userName = action.userName;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).userName = action.userName;
      }
    }

    return recomendedUsers;

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
  } else if( action is UpdatePhoneAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).phone = action.phone;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).phone = action.phone;
      }
    }

    return recomendedUsers;
  } else if( action is UpdateTcIdNoAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.nationalIdentityNumber = action.tcIdNo;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).identity?.nationalIdentityNumber = action.tcIdNo;
      }
    }

    return recomendedUsers;
  }else if ( action is UpdatePaymentInfoAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).iban = action.iban;
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).iban = action.iban;
      }
    }
  } else if ( action is SetUserAuthRoleRequestAction ){
    if(recomendedUsers != null && recomendedUsers.recentlySeenUsers != null) {
      bool isUserExist = recomendedUsers.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        recomendedUsers.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).authRole = int.parse(action.roleId);
      }
    }

    if(recomendedUsers != null && recomendedUsers.users != null) {
      bool isUserExist = recomendedUsers.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        recomendedUsers.users?.firstWhere((element) => element.userId == action.userId).authRole = int.parse(action.roleId);
      }
    }
  }

  return recomendedUsers;
}