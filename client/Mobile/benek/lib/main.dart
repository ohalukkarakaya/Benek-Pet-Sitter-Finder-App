import 'package:benek/app/app.dart';
import 'package:benek/common/utils/client_id.dart';
import 'package:flutter/material.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:benek/store/app_redux_store.dart';
import 'store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'dart:ui' as ui;
import 'store/actions/app_actions.dart';

void main() async {
  await dotenv.load(fileName: ".env");
  final Store<AppState> store = AppReduxStore.getInitialStore();

  String deviceLanguage = ui.window.locale.languageCode;
  await store.dispatch(SetDeviceLanguageAction(deviceLanguage));

  runApp(BenekApp(store));
}
