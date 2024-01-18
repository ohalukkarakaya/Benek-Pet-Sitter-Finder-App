import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/constants/tabs_enum.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import '../data/models/kulube_login_qr_code_model.dart';

class AppState {
  final int counter;

  final AppTabsEnums activeTab;
  final AppScreenEnums activeScreen;
  final KulubeLoginQrCodeModel loginQrCodeData;
  final String userRefreshToken;
  final String userAccessToken;
  final int userRoleId;
  final UserInfo? userInfo;
  final bool isLoading;

  AppState({
    required this.counter,

    required this.activeTab,
    required this.activeScreen,
    required this.loginQrCodeData,
    required this.userRefreshToken,
    required this.userAccessToken,
    required this.userRoleId,
    required this.userInfo,
    required this.isLoading
  });

  factory AppState.initial() {
    return AppState(
      counter: 0,

      activeTab: AppTabsEnums.HOME_TAB,
      activeScreen: AppScreenEnums.LOADING_SCREEN,
      loginQrCodeData: KulubeLoginQrCodeModel(qrCode: '', clientId: '', expireTime: null),
      userRefreshToken: '',
      userAccessToken:  '',
      userRoleId: 0,
      userInfo: null,
      isLoading: true
    );
  }

  AppState copyWith({
    int? counter,

    AppTabsEnums? activeTab,
    AppScreenEnums? activeScreen,
    KulubeLoginQrCodeModel? loginQrCodeData,
    String? userRefreshToken,
    String? userAccessToken,
    int? userRoleId,
    bool? isLoading
  }) {
    return AppState(
      counter: counter ?? this.counter,

      activeTab: activeTab ?? this.activeTab,
      activeScreen: activeScreen ?? this.activeScreen,
      loginQrCodeData: loginQrCodeData ?? this.loginQrCodeData,
      userRefreshToken: userRefreshToken ?? this.userRefreshToken,
      userAccessToken: userAccessToken ?? this.userAccessToken,
      userRoleId: userRoleId ?? this.userRoleId,
      userInfo: userInfo ?? this.userInfo,
      isLoading: isLoading ?? this.isLoading
    );
  }
}