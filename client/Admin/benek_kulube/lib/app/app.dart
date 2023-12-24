import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import '../store/store.dart';
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
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CounterWidget(),
              ],
            ),
          ],
        ),
      ),
    );
  }
}