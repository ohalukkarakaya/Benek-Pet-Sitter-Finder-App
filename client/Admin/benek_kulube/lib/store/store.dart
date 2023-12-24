import 'package:flutter/material.dart';
import 'package:redux/redux.dart';
import 'middleware/index.dart';
import 'reducers/index.dart';
import '../app/app.dart';

class AppState {
  final int counter;

  final String userRefreshToken;
  final String userAccessToken;
  final int userRoleId;

  AppState({
    required this.counter,

    required this.userRefreshToken,
    required this.userAccessToken,
    required this.userRoleId
  });

  factory AppState.initial() {
    return AppState(
      counter: 0,

      userRefreshToken: '',
      userAccessToken:  '',
      userRoleId: 0
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

      userRefreshToken: userRefreshToken ?? this.userRefreshToken,
      userAccessToken: userAccessToken ?? this.userAccessToken,
      userRoleId: userRoleId ?? this.userRoleId,
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

void main() {
  final Store<AppState> store = createStore();

  runApp(KulubeApp(store));
}