import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:redux/redux.dart';
import '../data/models/kulube_login_qr_code_model.dart';
import 'middleware/middlewares.dart';
import 'reducers/app_reducers.dart';

class AppState {
  final int counter;

  final AppScreenEnums activeScreen;
  final KulubeLoginQrCodeModel loginQrCodeData;
  final String userRefreshToken;
  final String userAccessToken;
  final int userRoleId;
  final bool isLoading;

  AppState({
    required this.counter,

    required this.activeScreen,
    required this.loginQrCodeData,
    required this.userRefreshToken,
    required this.userAccessToken,
    required this.userRoleId,
    required this.isLoading
  });

  factory AppState.initial() {
    return AppState(
      counter: 0,

      activeScreen: AppScreenEnums.LOADING_SCREEN,
      loginQrCodeData: KulubeLoginQrCodeModel(qrCode: '', clientId: '', expireTime: null),
      userRefreshToken: '',
      userAccessToken:  '',
      userRoleId: 0,
      isLoading: true
    );
  }

  AppState copyWith({
    int? counter,

    AppScreenEnums? activeScreen,
    KulubeLoginQrCodeModel? loginQrCodeData,
    String? userRefreshToken,
    String? userAccessToken,
    int? userRoleId,
    bool? isLoading
  }) {
    return AppState(
      counter: counter ?? this.counter,

      activeScreen: activeScreen ?? this.activeScreen,
      loginQrCodeData: loginQrCodeData ?? this.loginQrCodeData,
      userRefreshToken: userRefreshToken ?? this.userRefreshToken,
      userAccessToken: userAccessToken ?? this.userAccessToken,
      userRoleId: userRoleId ?? this.userRoleId,
      isLoading: isLoading ?? this.isLoading
    );
  }
}

Store<AppState> createStore() {
  return Store<AppState>(
    appReducer,
    initialState: AppState.initial(),
    middleware: [exampleMiddleware],
  );
}