import 'dart:io';

import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';
import 'app/app.dart';
import 'store/app_state.dart';
import 'package:redux/redux.dart';
import 'package:flutter_acrylic/flutter_acrylic.dart';
import 'package:desktop_window/desktop_window.dart';

void initMacOSWindow(Size size) async {
  if (Platform.isMacOS) {
    await DesktopWindow.setWindowSize(size);

    await DesktopWindow.setMaxWindowSize(size);
    await DesktopWindow.setMinWindowSize(size);
  }
}

void initWindowsAndLinuxWindow() async {
  if (Platform.isWindows || Platform.isLinux) {
    WidgetsFlutterBinding.ensureInitialized();
    await Window.initialize();

    if (Platform.isWindows) {
      await Window.hideWindowControls();
    }

    await Window.hideTitle();
    await Window.makeTitlebarTransparent();

    await Window.setEffect(
        effect: WindowEffect.mica,
        color: Platform.isWindows ? const Color(0xCC222222) : Colors.transparent,
        dark: true
    );
  }
}

void main() async {
  final Store<AppState> store = createStore();
  Size windowSize = const Size(1200,800);

  initWindowsAndLinuxWindow();
  
  runApp(KulubeApp(store));

  initMacOSWindow(windowSize);

  if (Platform.isWindows) {
    doWhenWindowReady(() {
      appWindow
        ..minSize = windowSize
        ..maxSize = windowSize
        ..size = windowSize
        ..alignment = Alignment.center
        ..show();
    });
  }
}