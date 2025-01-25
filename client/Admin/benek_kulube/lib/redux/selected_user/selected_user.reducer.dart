import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../data/models/chat_models/punishment_info_model.dart';

UserInfo? setSelectedUserReducer( UserInfo? userInfo, dynamic action ){

  if( action is SetSelectedUserAction ){
    return action.selectedUserInfo;
  }else if( action is GetUserInfoByUserIdAction ){
    ChatStateModel? chatData = userInfo?.chatData;
    action.userData?.chatData = chatData;
    return action.userData;
  }else if( action is GetSelectedUserStarDataAction ){
    userInfo?.stars = action.stars;
    return userInfo;
  }else if( action is GetPetsByUserIdRequestAction ){
    userInfo?.addPets(action.pets!);
    return userInfo;
  }else if( action is InitPastCareGiversAction ){
    userInfo?.addPastCareGivers(action.pastCareGiversList!);
    return userInfo;
  }else if( action is InitCareGiveDataAction ){
    userInfo?.addCareGiveCareer(action.careGiveList!);
    return userInfo;
  }else if( action is GetUsersChatAsAdminRequestAction ){
    userInfo?.chatData = action.chatData;
    return userInfo;
  }else if( action is GetLogsByUserIdRequestAction ){
    userInfo?.logs = action.dataList;
    return userInfo;
  }else if( action is GetUsersPunishmentCountRequestAction ){
    userInfo?.punishmentInfo ?? (
        userInfo?.punishmentInfo = PunishmentInfoModel(
          punishmentCount: 0,
          punishmentList: []
        )
    );
    userInfo?.punishmentInfo?.setPunishmentCount(action.usersPunishmentCount);

    return userInfo;
  }else if( action is PunishUserAction ){
    if( userInfo?.punishmentInfo == null ){
      userInfo?.punishmentInfo = PunishmentInfoModel(
        punishmentCount: 1,
        punishmentList: []
      );
    } else {
      userInfo?.punishmentInfo?.punishmentCount = userInfo.punishmentInfo!.punishmentCount != null
          ? userInfo.punishmentInfo!.punishmentCount! + 1
          : 1;

      userInfo?.didUserBanned = action.didUserBanned;
    }
    return userInfo;
  } else if( action is UpdateProfileImageRequestAction ){
    userInfo?.profileImg = action.userProfileImage;
    return userInfo;
  }else if( action is UpdateBioRequestAction ){
    userInfo?.identity?.bio = action.newBio;
    return userInfo;
  }else if( action is UpdateAddressRequestAction ) {
    userInfo?.identity?.openAdress = action.newOpenAddress;
    userInfo?.location = action.newLocation;
    return userInfo;
  } else if( action is BecomeCareGiverAction ) {
    userInfo?.isCareGiver = true;
  } else if( action is UpdateFullNameRequestAction ){
    userInfo?.identity?.firstName = action.firstName;
    userInfo?.identity?.middleName = action.middleName;
    userInfo?.identity?.lastName = action.lastName;
    return userInfo;
  } else if( action is UpdateUserNameAction ){
    userInfo?.userName = action.userName;
  } else if( action is UpdateEmailAction ){
    userInfo?.email = action.email;
    return userInfo;
  } else if( action is UpdateTcIdNoAction ){
    userInfo?.identity?.nationalIdentityNumber = action.tcIdNo;
    return userInfo;
  } else if ( action is UpdatePaymentInfoAction ){
    userInfo?.iban = action.iban;
  } else if ( action is SetUserAuthRoleRequestAction ){
    if(action.userId == userInfo?.userId) {
      userInfo?.authRole = int.parse(action.roleId);
    }
  }

  return userInfo;
}