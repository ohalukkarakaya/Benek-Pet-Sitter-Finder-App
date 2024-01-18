import 'package:benek_kulube/data/models/user_profile_models/user_care_giver_career_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_deactivation_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_following_users_or_pets_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_identity_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_interesting_pet_tags_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_location_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_past_care_givers_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_star_model.dart';

class UserInfo {
  String? userId;
  String? userName;
  UserIdentity? identity;
  String? email;
  String? phone;
  bool? isEmailVerified;
  bool? isPhoneVerified;
  UserLocation? location;
  UserProfileImg? profileImg;
  List<String>? pets;
  bool? isCareGiver;
  List<UserPastCaregivers>? pastCaregivers;
  List<UserCaregiverCareer>? caregiverCareer;
  List<UserFollowingUsersOrPets>? followingUsersOrPets;
  List<String>? blockedUsers;
  List<String>? followers;
  List<String>? saved;
  List<String>? dependedUsers;
  UserDeactivation? deactivation;
  List<UserStars>? stars;
  List<UserInterestingPetTags>? interestingPetTags;
  String? gender;
  String? defaultImage;
  int? totalStar;

  UserInfo(
    {
      this.userId,
      this.userName,
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
      this.totalStar
    }
  );

  UserInfo.fromJson( Map<String, dynamic> json ){
    userId = json['_id'];
    userName = json['userName'];
    identity = json['identity'] != null
        ? UserIdentity.fromJson( json['identity'] )
        : null;
    email = json['email'];
    phone = json['phone'];
    isEmailVerified = json['isEmailVerified'];
    isPhoneVerified = json['isPhoneVerified'];
    location = json['location'] != null
        ? UserLocation.fromJson( json['location'] )
        : null;
    profileImg = json['profileImg'] != null
        ? UserProfileImg.fromJson( json['profileImg'] )
        : null;
    pets = json['pets'].cast<String>();
    isCareGiver = json['isCareGiver'];
    if( json['pastCaregivers'] != null ){
      pastCaregivers = <UserPastCaregivers>[];
      json['pastCaregivers'].forEach(
        ( v ){
          pastCaregivers!.add( UserPastCaregivers.fromJson( v ) );
        }
      );
    }
    if( json['caregiverCareer'] != null ){
      caregiverCareer = <UserCaregiverCareer>[];
      json['caregiverCareer'].forEach(
        ( v ){
          caregiverCareer!.add( UserCaregiverCareer.fromJson( v ) );
        }
      );
    }
    if( json['followingUsersOrPets'] != null ){
      followingUsersOrPets = <UserFollowingUsersOrPets>[];
      json['followingUsersOrPets'].forEach(
        ( v ){
         followingUsersOrPets!.add( UserFollowingUsersOrPets.fromJson( v ) );
        }
      );
    }
    blockedUsers = json['blockedUsers'].cast<String>();
    followers = json['followers'].cast<String>();
    saved = json['saved'].cast<String>();
    dependedUsers = json['dependedUsers'].cast<String>();
    deactivation = json['deactivation'] != null
        ? UserDeactivation.fromJson(json['deactivation'])
        : null;
    if( json['stars'] != null ){
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
    defaultImage = json['defaultImage'];
    totalStar = json['totalStar'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = userId;
    data['userName'] = userName;
    if( identity != null ){
      data['identity'] = identity!.toJson();
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
      data['stars'] = stars!.map(
        ( v ) => 
              v.toJson()
      ).toList();
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
    return data;
  }
}