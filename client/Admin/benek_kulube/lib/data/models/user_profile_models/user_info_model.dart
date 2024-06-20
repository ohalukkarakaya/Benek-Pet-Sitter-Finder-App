import 'package:benek_kulube/data/models/chat_models/chat_state_model.dart';
import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_deactivation_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_following_users_or_pets_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_identity_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_interesting_pet_tags_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_location_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_past_care_givers_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_star_model.dart';

import '../log_models/log_model.dart';

class UserInfo {
  String? userId;
  String? userName;
  int? authRole;
  UserIdentity? identity;
  String? email;
  String? phone;
  bool? isEmailVerified;
  bool? isPhoneVerified;
  UserLocation? location;
  UserProfileImg? profileImg;
  List<dynamic>? pets;
  bool? isCareGiver;
  List<UserPastCaregivers>? pastCaregivers;
  List<UserCaregiverCareer>? caregiverCareer;
  List<UserFollowingUsersOrPets>? followingUsersOrPets;
  List<String>? blockedUsers;
  List<String>? followers;
  List<String>? saved;
  List<String>? dependedUsers;
  UserDeactivation? deactivation;
  dynamic stars;
  List<UserInterestingPetTags>? interestingPetTags;
  String? gender;
  String? defaultImage;
  int? totalStar;
  ChatStateModel? chatData;
  List<LogModel>? logs;

  UserInfo(
    {
      this.userId,
      this.userName,
      this.authRole,
      this.identity,
      this.email,
      this.phone,
      this.isEmailVerified,
      this.isPhoneVerified,
      this.location,
      this.profileImg,
      this.pets,
      this.isCareGiver,
      this.pastCaregivers,
      this.caregiverCareer,
      this.followingUsersOrPets,
      this.blockedUsers,
      this.followers,
      this.saved,
      this.dependedUsers,
      this.deactivation,
      this.stars,
      this.interestingPetTags,
      this.gender,
      this.defaultImage,
      this.totalStar,
      this.chatData,
      this.logs
    }
  );

  UserInfo.fromJson( Map<String, dynamic> json ){
    userId = json['userId'] ?? json ['_id'];
    userName = json['userName'] ?? json['username'];
    authRole = json['authRole'] ?? 0;
    identity = json['identity'] != null
        ? UserIdentity.fromJson( json['identity'] )
        : json[ 'userFullName' ] != null
          ? UserIdentity(
              firstName: json['userFullName'].toString().split(" ")[0],
              middleName: json['userFullName'].toString().split(" ").length > 2 ? json['userFullName'].toString().split(" ")[1] : null,
              lastName: json['userFullName'].toString().split(" ").length > 2 ? json['userFullName'].toString().split(" ")[2] : json['userFullName'].toString().split(" ")[1],
            )
          : null;
    email = json['email'];
    phone = json['phone'];
    isEmailVerified = json['isEmailVerified'];
    isPhoneVerified = json['isPhoneVerified'];
    location = json['location'] != null
        ? UserLocation.fromJson( json['location'] )
        : null;
    profileImg = json['profileImg'] != null
        && json['isProfileImageDefault'] != null
          ? UserProfileImg(
              imgUrl: json['profileImg'],
              isDefaultImg: json['isProfileImageDefault'],
          )
          : json['profileImg'] != null
            ? UserProfileImg.fromJson( json['profileImg'] )
            : json['userProfileImg'] != null
              ? UserProfileImg(
                  imgUrl: json['userProfileImg'],
                  isDefaultImg: json['isProfileImageDefault'],
              )
              : null;
    pets = json['pets'] != null ? json['pets'].cast<dynamic>() : <dynamic>[];
    isCareGiver = json['isCareGiver'];
    if( json['pastCaregivers'] != null || json['pastCareGivers'] != null ){
      List<dynamic> jsonList = json['pastCaregivers'] != null && json['pastCaregivers'].length > 0
          ? json['pastCaregivers']
          : json['pastCareGivers'] ?? <dynamic>[];
      List <UserPastCaregivers> list = jsonList.map((item) => UserPastCaregivers.fromJson(item)).toList();
      pastCaregivers = list;
    }
    if( json['caregiverCareer'] != null || json['careGiverCareer'] != null ){
      List<dynamic> jsonList = json['caregiverCareer'] != null && json['caregiverCareer'].length > 0
          ? json['caregiverCareer']
          : json['careGiverCareer'] ?? <dynamic>[];
      List <UserCaregiverCareer> list = jsonList.map((item) => UserCaregiverCareer.fromJson(item)).toList();
      caregiverCareer = list;
    }
    if( json['followingUsersOrPets'] != null ){
      followingUsersOrPets = <UserFollowingUsersOrPets>[];
      json['followingUsersOrPets'].forEach(
        ( v ){
         followingUsersOrPets!.add( UserFollowingUsersOrPets.fromJson( v ) );
        }
      );
    }
    blockedUsers = json['blockedUsers'] != null
                      ? json['blockedUsers'].cast<String>()
                      : <String>[];
    followers = json['followers'] != null
                    ? json['followers'].cast<String>()
                    : <String>[];
    saved = json['saved'] != null
              ? json['saved'].cast<String>()
              : <String>[];
    dependedUsers = json['dependedUsers'] != null
                      ? json['dependedUsers'].cast<String>()
                      : <String>[];
    deactivation = json['deactivation'] != null
        ? UserDeactivation.fromJson(json['deactivation'])
        : null;
    if( json['stars'] == null ){
      stars = null;
    }else if( json['stars'].runtimeType == int ){
      stars = json['stars'];
    }else{
      stars = <UserStars>[];
      json['stars'].forEach(
        ( v ){
          stars!.add( UserStars.fromJson( v ) );
        }
      );
    }
    if( json['interestingPetTags'] != null ){
      interestingPetTags = <UserInterestingPetTags>[];
      json['interestingPetTags'].forEach(
        ( v ){
          interestingPetTags!.add( UserInterestingPetTags.fromJson( v ) );
        }
      );
    }
    gender = json['gender'];
    defaultImage = json['defaultImage'] ?? json['userProfileImg'];
    totalStar = json['totalStar'];
    chatData = json['chatData'] != null
        ? ChatStateModel.fromJson( json['chatData'] )
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = userId;
    data['userName'] = userName;
    if( identity != null ){
      data['identity'] = identity!.toJson();
    }
    if( authRole != null ){
      data['authRole'] = authRole;
    }
    data['email'] = email;
    data['phone'] = phone;
    data['isEmailVerified'] = isEmailVerified;
    data['isPhoneVerified'] = isPhoneVerified;
    if( location != null ){
      data['location'] = location!.toJson();
    }
    if( profileImg != null ){
      data['profileImg'] = profileImg!.toJson();
    }
    data['pets'] = pets;
    data['isCareGiver'] = isCareGiver;
    if( pastCaregivers != null ){
      data['pastCaregivers'] = pastCaregivers!.map(
        ( v ) => 
              v.toJson()
      ).toList();
    }
    if( caregiverCareer != null ){
      data['caregiverCareer'] = caregiverCareer!.map(
        ( v ) => 
              v.toJson()
      ).toList();
    }
    if( followingUsersOrPets != null ){
      data['followingUsersOrPets'] = followingUsersOrPets!.map(
        ( v ) => 
              v.toJson()
      ).toList();
    }
    data['blockedUsers'] = blockedUsers;
    data['followers'] = followers;
    data['saved'] = saved;
    data['dependedUsers'] = dependedUsers;
    if( deactivation != null ){
      data['deactivation'] = deactivation!.toJson();
    }
    if( stars != null){
      data['stars'] = stars;
    }
    if( interestingPetTags != null ){
      data['interestingPetTags'] = interestingPetTags!.map(
        ( v ) => 
              v.toJson()
      ).toList();
    }
    data['gender'] = gender;
    data['defaultImage'] = defaultImage;
    data['totalStar'] = totalStar;
    if( chatData != null ){
      data['chatData'] = chatData!.toJson();
    }
    return data;
  }

  dynamic addPets( List<PetModel> petDataList ){
    pets = petDataList;
  }

  dynamic addPastCareGivers( List<UserPastCaregivers> pastCareGiversDataList ){
    pastCaregivers = pastCareGiversDataList;
  }

  dynamic addCareGiveCareer( List<UserCaregiverCareer> careGiverCareerDataList ){
    caregiverCareer = careGiverCareerDataList;
  }

  dynamic addChatData( ChatStateModel inComingChatData ){
    chatData = inComingChatData;
  }

  dynamic addLogData( List<LogModel> inComingLogListData ){
    logs = inComingLogListData;
  }
}