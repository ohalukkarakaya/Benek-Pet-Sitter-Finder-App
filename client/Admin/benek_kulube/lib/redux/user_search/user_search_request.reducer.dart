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
  }else if( action is UpdateAddressRequestAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.openAdress = action.newOpenAddress;
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).location = action.newLocation;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).identity?.openAdress = action.newOpenAddress;

        userSearchListData.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).location = action.newLocation;
      }
    }

    return userSearchListData;
  } else if (action is BecomeCareGiverAction) {
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).isCareGiver = true;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere(
              (element) => element.userId == action.userId,
        ).isCareGiver = true;
      }
    }

    return userSearchListData;
  } else if( action is UpdateFullNameRequestAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.firstName = action.firstName;
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.middleName = action.middleName;
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.lastName = action.lastName;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).identity?.firstName = action.firstName;
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).identity?.middleName = action.middleName;
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).identity?.lastName = action.lastName;
      }
    }

    return userSearchListData;
  }else if( action is UpdateUserNameAction ) {
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).userName = action.userName;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).userName = action.userName;
      }
    }

    return userSearchListData;

  }else if( action is UpdateEmailAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).email = action.email;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).email = action.email;
      }
    }

    return userSearchListData;
  }else if( action is UpdateTcIdNoAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).identity?.nationalIdentityNumber = action.tcIdNo;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).identity?.nationalIdentityNumber = action.tcIdNo;
      }
    }

    return userSearchListData;
  } else if ( action is UpdatePaymentInfoAction ){
    if(userSearchListData != null && userSearchListData.recentlySeenUsers != null) {
      bool isUserExist = userSearchListData.recentlySeenUsers!.any((element) => element.userId == action.userId);

      if(isUserExist) {
        userSearchListData.recentlySeenUsers?.firstWhere((element) => element.userId == action.userId).iban = action.iban;
      }
    }

    if(userSearchListData != null && userSearchListData.users != null) {
      bool isUserExist = userSearchListData.users!.any((element) => element.userId == action.userId);

      if(isUserExist){
        userSearchListData.users?.firstWhere((element) => element.userId == action.userId).iban = action.iban;
      }
    }

    return userSearchListData;
  }

  return userSearchListData;
}