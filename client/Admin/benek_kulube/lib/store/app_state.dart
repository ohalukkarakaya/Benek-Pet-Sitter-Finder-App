import 'package:redux/redux.dart';
import '../data/services/app_screens_enum.dart';
import 'middleware/middlewares.dart';
import 'reducers/app_reducers.dart';

class AppState {
  final int counter;

  final AppScreens activeScreen;
  final String userRefreshToken;
  final String userAccessToken;
  final int userRoleId;
  final bool isLoading;

  AppState({
    required this.counter,

    required this.activeScreen,
    required this.userRefreshToken,
    required this.userAccessToken,
    required this.userRoleId,
    required this.isLoading
  });

  factory AppState.initial() {
    return AppState(
      counter: 0,

      activeScreen: AppScreens.LOADING_SCREEN,
      userRefreshToken: '',
      userAccessToken:  '',
      userRoleId: 0,
      isLoading: true
    );
  }

  AppState copyWith({
    int? counter,

    String? userRefreshToken,
    String? userAccessToken,
    int? userRoleId,
  }) {
    return AppState(
      counter: counter ?? this.counter,

      activeScreen: activeScreen,
      userRefreshToken: userRefreshToken ?? this.userRefreshToken,
      userAccessToken: userAccessToken ?? this.userAccessToken,
      userRoleId: userRoleId ?? this.userRoleId,
      isLoading: isLoading
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