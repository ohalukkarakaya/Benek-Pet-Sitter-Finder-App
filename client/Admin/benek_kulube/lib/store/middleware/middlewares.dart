import 'dart:developer';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import '../app_state.dart';

void exampleMiddleware(
  Store<AppState> store,
  dynamic action,
  NextDispatcher next,
) {
  log('Action: ${action.toString()}');
  next(action);
}