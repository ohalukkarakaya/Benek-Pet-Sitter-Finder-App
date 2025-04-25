import 'dart:developer';

import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/presentation/shared/screens/login_screen.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

import 'package:connectivity_plus/connectivity_plus.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import '../presentation/shared/components/loading_components/benek_loading_component.dart';
import '../presentation/shared/screens/error_screen.dart';
import '../presentation/shared/screens/home_screen.dart';
import '../presentation/shared/screens/no_Internet_connection_screen.dart';
import '../store/app_state.dart';

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
          fontFamily: defaultFontFamily(),
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

class KulubeHomePage extends StatefulWidget {
  const KulubeHomePage({super.key});

  @override
  State<KulubeHomePage> createState() => _KulubeHomePageState();
}

class _KulubeHomePageState extends State<KulubeHomePage> {
  bool? _hasInternet;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      var connectivityResult = await Connectivity().checkConnectivity();
      setState(() {
        _hasInternet = connectivityResult != ConnectivityResult.none;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, AppState>(
      converter: (store) => store.state,
      builder: (BuildContext context, AppState state) {
        var store = StoreProvider.of<AppState>( context );
        AppReduxStore.currentStore = store;

        if (_hasInternet == null || !_hasInternet!) {
          log( 'No internet connection' );
          return NoInternetConnectionScreen( store: store );
        }

        if(
          _hasInternet == true
          && state.userRefreshToken == ''
          && state.userAccessToken == ''
          && state.activeScreen == AppScreenEnums.LOADING_SCREEN
        ){
          AuthUtils.setCredentials();
        }

        return Stack(
          children: [
             Scaffold(
                  backgroundColor: Colors.transparent,
                  appBar: null,
                  body: state.activeScreen == AppScreenEnums.LOADING_SCREEN
                        && state.userRefreshToken == ''

                            ? const Center( child: BenekLoadingComponent() )
                            : state.activeScreen == AppScreenEnums.LOGIN_SCREEN

                                // ignore: prefer_const_constructors
                                ? LoginScreen()
                                : store.state.activeScreen == AppScreenEnums.HOME_SCREEN

                                      ? HomeScreen( store: store)
                                      : store.state.activeScreen == AppScreenEnums.ERROR_SCREEN

                                          ? ErrorScreen( store: store, )
                                          : const SizedBox()
                ),
          ],
        );
      }
    );
  }
}