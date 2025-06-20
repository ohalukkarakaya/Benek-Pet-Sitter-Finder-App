import 'package:benek/common/constants/app_screens_enum.dart';
import 'package:benek/common/constants/tabs_enum.dart';
import 'package:benek/data/models/care_give_models/report_state_model.dart';
import 'package:benek/data/models/payment_data_models/payment_satate_model.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:benek/data/models/user_profile_models/user_list_model.dart';
import 'package:geolocator/geolocator.dart';
import '../data/models/pet_models/pet_list_model.dart';
import '../data/models/pet_models/pet_model.dart';
import '../data/models/story_models/story_model.dart';

class AppState {
  final int processCounter;

  final String deviceLanguage;
  final AppTabsEnums activeTab;
  final AppScreenEnums activeScreen;
  final String userRefreshToken;
  final String userAccessToken;
  final int userRoleId;
  final UserInfo? userInfo;
  final bool isLoading;
  final Position? currentLocation;
  final UserList? recomendedUsersList;
  final UserList? userSearchResultList;
  final PetListModel? petSearchResultList;
  final UserInfo? selectedUserInfo;
  final PetModel? selectedPet;
  final List<StoryModel>? storiesToDisplay;
  final StoryModel? selectedStory;
  final ReportStateModel? reports;
  final PaymentStateModel? paymentData;
  final UserList? employees;

  AppState({
    required this.processCounter,

    required this.deviceLanguage,
    required this.activeTab,
    required this.activeScreen,
    required this.userRefreshToken,
    required this.userAccessToken,
    required this.userRoleId,
    required this.userInfo,
    required this.isLoading,
    required this.currentLocation,
    required this.recomendedUsersList,
    required this.userSearchResultList,
    required this.petSearchResultList,
    required this.selectedUserInfo,
    this.selectedPet,
    required this.storiesToDisplay,
    this.selectedStory,
    this.reports,
    this.paymentData,
    this.employees,
  });

  factory AppState.initial() {
    return AppState(
      processCounter: 0,

      deviceLanguage: 'tr',
      activeTab: AppTabsEnums.HOME_TAB,
      activeScreen: AppScreenEnums.LOADING_SCREEN,
      userRefreshToken: '',
      userAccessToken:  '',
      userRoleId: 0,
      userInfo: null,
      isLoading: false,
      currentLocation: null,
      recomendedUsersList: null,
      userSearchResultList: null,
      petSearchResultList: null,
      selectedUserInfo: null,
      selectedPet: null,
      storiesToDisplay: null,
      selectedStory: null,
      reports: null,
      paymentData: null,
      employees: null,
    );
  }

  AppState copyWith({
    int? processCounter,

    String? deviceLanguage,
    AppTabsEnums? activeTab,
    AppScreenEnums? activeScreen,
    String? userRefreshToken,
    String? userAccessToken,
    int? userRoleId,
    UserInfo? userInfo,
    bool? isLoading,
    Position? currentLocation,
    UserList? recomendedUsersList,
    UserList? userSearchResultList,
    PetListModel? petSearchResultList,
    UserInfo? selectedUserInfo,
    PetModel? selectedPet,
    List<StoryModel>? storiesToDisplay,
    StoryModel? selectedStory,
    ReportStateModel? reports,
    PaymentStateModel? paymentData,
    UserList? employees,
  }) {
    return AppState(
      processCounter: processCounter ?? this.processCounter,
      
      deviceLanguage: deviceLanguage ?? this.deviceLanguage,
      activeTab: activeTab ?? this.activeTab,
      activeScreen: activeScreen ?? this.activeScreen,
      userRefreshToken: userRefreshToken ?? this.userRefreshToken,
      userAccessToken: userAccessToken ?? this.userAccessToken,
      userRoleId: userRoleId ?? this.userRoleId,
      userInfo: userInfo ?? this.userInfo,
      isLoading: isLoading ?? this.isLoading,
      currentLocation: currentLocation ?? this.currentLocation,
      recomendedUsersList: recomendedUsersList ?? this.recomendedUsersList,
      userSearchResultList: userSearchResultList ?? this.userSearchResultList,
      petSearchResultList: petSearchResultList ?? this.petSearchResultList,
      selectedUserInfo: selectedUserInfo ?? this.selectedUserInfo,
      selectedPet: selectedPet ?? this.selectedPet,
      storiesToDisplay: storiesToDisplay ?? this.storiesToDisplay,
      selectedStory: selectedStory ?? this.selectedStory,
      reports: reports ?? this.reports,
      paymentData: paymentData ?? this.paymentData,
      employees: employees ?? this.employees,
    );
  }
}