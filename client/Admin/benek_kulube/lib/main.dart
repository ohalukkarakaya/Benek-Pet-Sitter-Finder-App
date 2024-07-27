import 'dart:io';

import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'app/app.dart';
import 'store/app_state.dart';
import 'store/actions/app_actions.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:flutter_acrylic/flutter_acrylic.dart';
import 'package:desktop_window/desktop_window.dart';
import 'dart:ui' as ui;
import 'package:video_player_media_kit/video_player_media_kit.dart';

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

  VideoPlayerMediaKit.ensureInitialized(
    macOS: true,
    windows: true,
    linux: true,
  );
  
  await dotenv.load(fileName: ".env");

  final Store<AppState> store = AppReduxStore.getInitialStore();
  Size windowSize = const Size(1200,800);

  initWindowsAndLinuxWindow();

  String deviceLanguage = ui.window.locale.languageCode;
  await store.dispatch(SetDeviceLanguageAction(deviceLanguage));
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