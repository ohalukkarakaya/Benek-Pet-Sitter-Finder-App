import 'dart:io';

import 'package:flutter/material.dart';
import 'app/app.dart';
import 'store/store.dart';
import 'package:redux/redux.dart';
import 'package:flutter_acrylic/flutter_acrylic.dart';

void main() async {
  final Store<AppState> store = createStore();

  WidgetsFlutterBinding.ensureInitialized();
  await Window.initialize();

  if (Platform.isWindows) {
    await Window.hideWindowControls();
  }
  
  if( Platform.isMacOS ) {
      await Window.setBlurViewState(
        MacOSBlurViewState.active,
      );
  }

  await Window.hideTitle();
  await Window.makeTitlebarTransparent();

  await Window.setEffect(
      effect: WindowEffect.mica,
      color: Platform.isWindows ? const Color(0xCC222222) : Colors.transparent,
      dark: true
  );
  runApp(KulubeApp(store));
}