import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import '../presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import '../store/app_state.dart';
import '../presentation/features/counter/components/counter_widget.dart';
import 'package:flutter_acrylic/flutter_acrylic.dart';

class KulubeApp extends StatelessWidget {
  final Store<AppState> store;

  const KulubeApp(this.store, {super.key});

  @override
  Widget build(BuildContext context) {
    return StoreProvider(
      store: store,
      child: MaterialApp(
        title: 'Benek Klübe - Çalışan Portalı',
        debugShowCheckedModeBanner: false,
        color: Colors.transparent,
        theme: ThemeData(
          splashFactory: InkRipple.splashFactory,
        ),
        darkTheme: ThemeData.dark().copyWith(
          splashFactory: InkRipple.splashFactory,
        ),
        themeMode: ThemeMode.dark,
        home: const KulubeHomePage(),
      ),
    );
  }
}

class KulubeHomePage extends StatelessWidget {
  const KulubeHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return TitlebarSafeArea(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar( backgroundColor: Colors.transparent, ),
        body: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CounterWidget(),
              ],
            ),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                BenekProcessIndicator(
                  width: 100,
                  height: 100,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}