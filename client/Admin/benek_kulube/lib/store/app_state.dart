import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/constants/tabs_enum.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:geolocator/geolocator.dart';
import '../data/models/kulube_login_qr_code_model.dart';
import '../data/models/story_models/story_model.dart';

class AppState {
  final int counter;

  final int processCounter;

  final String deviceLanguage;
  final AppTabsEnums activeTab;
  final AppScreenEnums activeScreen;
  final KulubeLoginQrCodeModel loginQrCodeData;
  final String userRefreshToken;
  final String userAccessToken;
  final int userRoleId;
  final UserInfo? userInfo;
  final bool isLoading;
  final Position? currentLocation;
  final UserList? recomendedUsersList;
  final UserList? userSearchResultList;
  final UserInfo? selectedUserInfo;
  final List<StoryModel>? storiesToDisplay;
  final StoryModel? selectedStory;

  AppState({
    required this.counter,

    required this.processCounter,

    required this.deviceLanguage,
    required this.activeTab,
    required this.activeScreen,
    required this.loginQrCodeData,
    required this.userRefreshToken,
    required this.userAccessToken,
    required this.userRoleId,
    required this.userInfo,
    required this.isLoading,
    required this.currentLocation,
    required this.recomendedUsersList,
    required this.userSearchResultList,
    required this.selectedUserInfo,
    required this.storiesToDisplay,
    this.selectedStory,
  });

  factory AppState.initial() {
    return AppState(
      counter: 0,

      processCounter: 0,

      deviceLanguage: 'tr',
      activeTab: AppTabsEnums.HOME_TAB,
      activeScreen: AppScreenEnums.LOADING_SCREEN,
      loginQrCodeData: KulubeLoginQrCodeModel(qrCode: '', clientId: '', expireTime: null),
      userRefreshToken: '',
      userAccessToken:  '',
      userRoleId: 0,
      userInfo: null,
      isLoading: false,
      currentLocation: null,
      recomendedUsersList: null,
      userSearchResultList: null,
      selectedUserInfo: null,
      storiesToDisplay: null,
      selectedStory: null,
    );
  }

  AppState copyWith({
    int? counter,

    int? processCounter,

    String? deviceLanguage,
    AppTabsEnums? activeTab,
    AppScreenEnums? activeScreen,
    KulubeLoginQrCodeModel? loginQrCodeData,
    String? userRefreshToken,
    String? userAccessToken,
    int? userRoleId,
    UserInfo? userInfo,
    bool? isLoading,
    Position? currentLocation,
    UserList? recomendedUsersList,
    UserList? userSearchResultList,
    UserInfo? selectedUserInfo,
    List<StoryModel>? storiesToDisplay,
    StoryModel? selectedStory,
  }) {
    return AppState(
      counter: counter ?? this.counter,

      processCounter: processCounter ?? this.processCounter,
      
      deviceLanguage: deviceLanguage ?? this.deviceLanguage,
      activeTab: activeTab ?? this.activeTab,
      activeScreen: activeScreen ?? this.activeScreen,
      loginQrCodeData: loginQrCodeData ?? this.loginQrCodeData,
      userRefreshToken: userRefreshToken ?? this.userRefreshToken,
      userAccessToken: userAccessToken ?? this.userAccessToken,
      userRoleId: userRoleId ?? this.userRoleId,
      userInfo: userInfo ?? this.userInfo,
      isLoading: isLoading ?? this.isLoading,
      currentLocation: currentLocation ?? this.currentLocation,
      recomendedUsersList: recomendedUsersList ?? this.recomendedUsersList,
      userSearchResultList: userSearchResultList ?? this.userSearchResultList,
      selectedUserInfo: selectedUserInfo ?? this.selectedUserInfo,
      storiesToDisplay: storiesToDisplay ?? this.storiesToDisplay,
      selectedStory: selectedStory ?? this.selectedStory,
    );
  }
}