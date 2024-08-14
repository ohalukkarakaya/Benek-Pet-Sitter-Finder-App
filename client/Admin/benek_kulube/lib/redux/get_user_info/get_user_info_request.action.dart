// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_location_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_profile_image_model.dart';
import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> getUserInfoRequestAction() {
  return (Store<AppState> store) async {
    UserInfoApi api = UserInfoApi();

    try {
      UserInfo _userInfo = await api.getUserInfoRequest();
      
      await store.dispatch(GetUserInfoRequestAction(_userInfo));
    } on ApiException catch (e) {
      log('ERROR: getUserInfoRequestAction - $e');
      await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> updateProfileImageRequestAction(String? filePath) {
  return (Store<AppState> store) async {
    UserInfoApi api = UserInfoApi();

    try {
      UserProfileImg? _userInfo = await api.putUpdateProfileImage(filePath);

      await store.dispatch(UpdateProfileImageRequestAction(_userInfo, store.state.userInfo!.userId!));
    } on ApiException catch (e) {
      log('ERROR: updateProfileImageRequestAction - $e');
    }
  };
}

ThunkAction<AppState> updateBioRequestAction(String newBio) {
  return (Store<AppState> store) async {
    UserInfoApi api = UserInfoApi();

    try {
      String? _userInfo = await api.putUpdateBio(newBio);

      await store.dispatch(UpdateBioRequestAction(_userInfo, store.state.userInfo!.userId!));
    } on ApiException catch (e) {
      log('ERROR: updateBioRequestAction - $e');
    }
  };
}

ThunkAction<AppState> updateAddressRequestAction(String country, String city, String openAdress, double lat, double lng) {
  return (Store<AppState> store) async {
    UserInfoApi api = UserInfoApi();

    try {
      Map<String, dynamic>? _addressInfo = await api.putUpdateAddress(country, city, openAdress, lat, lng);

      await store.dispatch(UpdateAddressRequestAction(_addressInfo?['userLocation'], _addressInfo?['openAdress'], store.state.userInfo?.userId));
    } on ApiException catch (e) {
      log('ERROR: updateBioRequestAction - $e');
    }
  };
}

ThunkAction<AppState> updateFullNameRequestAction(String fullname) {
  return (Store<AppState> store) async {
    UserInfoApi api = UserInfoApi();

    try {
      Map<String, dynamic>? _nameInfo = await api.putUpdateFullname(fullname);

      await store.dispatch(UpdateFullNameRequestAction(_nameInfo?['firstName'], _nameInfo?['middleName'], _nameInfo?['lastName'], store.state.userInfo?.userId));
    } on ApiException catch (e) {
      log('ERROR: updateBioRequestAction - $e');
    }
  };
}

class GetUserInfoRequestAction {
  final UserInfo? _userInfo;
  UserInfo? get userInfo => _userInfo;
  GetUserInfoRequestAction(this._userInfo);
}

class UpdateProfileImageRequestAction {
  final UserProfileImg? _userProfileImage;
  final String? _userId;

  UserProfileImg? get userProfileImage => _userProfileImage;
  String? get userId => _userId;

  UpdateProfileImageRequestAction(this._userProfileImage, this._userId);
}

class UpdateBioRequestAction {
  final String? _newBio;
  final String? _userId;

  String? get newBio => _newBio;
  String? get userId => _userId;

  UpdateBioRequestAction(this._newBio, this._userId);
}

class UpdateAddressRequestAction {
  final UserLocation? _newLocation;
  final String? _newOpenAddress;
  final String? _userId;

  UserLocation? get newLocation => _newLocation;
  String? get newOpenAddress => _newOpenAddress;
  String? get userId => _userId;

  UpdateAddressRequestAction(this._newLocation, this._newOpenAddress, this._userId);
}

class UpdateFullNameRequestAction {
  final String? _firstName;
  final String? _middleName;
  final String? _lastName;
  final String? _userId;

  String? get firstName => _firstName;
  String? get middleName => _middleName;
  String? get lastName => _lastName;
  String? get userId => _userId;

  UpdateFullNameRequestAction(this._firstName, this._middleName, this._lastName, this._userId);
}