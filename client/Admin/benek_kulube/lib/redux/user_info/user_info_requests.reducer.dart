import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';


UserInfo? getUserInfoRequestReducer( UserInfo? userInfo, dynamic action ){
  if( action is GetUserInfoRequestAction ){
    return action.userInfo;
  }else if( action is GetRecommendedPetsRequestAction ){
    userInfo?.addRecommendedPets(action.dataList!);
    return userInfo;
  }else if( action is GetUsersPrivateInfoRequestAction ){
    userInfo?.addPrivateInfo(action.userPrivateInfo!);
    return userInfo;
  }else if( action is UpdateProfileImageRequestAction ){
    userInfo?.profileImg = action.userProfileImage;
    return userInfo;
  }else if( action is UpdateBioRequestAction ) {
    userInfo?.identity!.bio = action.newBio;
    return userInfo;
  }else if( action is UpdateAddressRequestAction ) {
    userInfo?.identity!.openAdress = action.newOpenAddress;
    userInfo?.location = action.newLocation;
    return userInfo;
  } else if( action is BecomeCareGiverAction) {
    userInfo?.isCareGiver = true;
  } else if( action is UpdateFullNameRequestAction ){
    userInfo?.identity!.firstName = action.firstName;
    userInfo?.identity!.middleName = action.middleName;
    userInfo?.identity!.lastName = action.lastName;
    return userInfo;
  } else if ( action is UpdateUserNameAction ){
    userInfo?.userName = action.userName;
  } else if ( action is UpdateEmailAction ){
    userInfo?.email = action.email;
    return userInfo;
  } else if( action is UpdatePhoneAction ){
    userInfo?.phone = action.phone;
    return userInfo;
  } else if ( action is UpdateTcIdNoAction ){
    userInfo?.identity!.nationalIdentityNumber = action.tcIdNo;
    return userInfo;
  } else if ( action is UpdatePaymentInfoAction ){
    userInfo?.iban = action.iban;
  } else if ( action is SetUserAuthRoleRequestAction ){
    if( userInfo?.userId == action.userId ) {
      userInfo?.authRole = int.parse(action.roleId);
    }
  }

  return userInfo;
}