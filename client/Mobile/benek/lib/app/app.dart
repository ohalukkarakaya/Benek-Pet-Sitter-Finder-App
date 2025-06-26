import 'dart:developer';

import 'package:benek/common/constants/app_screens_enum.dart';
import 'package:benek/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek/common/utils/styles.text.dart';
import 'package:benek/common/widgets/video_bg_widget/video_bg_widget.dart';
import 'package:benek/presentation/shared/screens/login_screen.dart';

import 'package:benek/store/app_redux_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

import 'package:connectivity_plus/connectivity_plus.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import '../presentation/shared/components/loading_components/benek_loading_component.dart';
import '../store/app_state.dart';

class BenekApp extends StatelessWidget {
  final Store<AppState> store;

  const BenekApp(this.store, {super.key});

  @override
  Widget build(BuildContext context) {
    return StoreProvider(
      store: store,
      child: MaterialApp(
        scrollBehavior: const ScrollBehavior().copyWith(scrollbars: false),
        title: 'Benek App',
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
        home: const BenekHomePage(),
      ),
    );
  }
}

class BenekHomePage extends StatefulWidget {
  const BenekHomePage({super.key});

  @override
  State<BenekHomePage> createState() => _BenekHomePageState();
}

class _BenekHomePageState extends State<BenekHomePage> {
  bool? _hasInternet;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // don't remove untill logout writen
      // final Store<AppState> store = AppReduxStore.getInitialStore();
      // AuthUtils.removeCredentials(store);

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
          return const SizedBox(); // NoInternetConnectionScreen( store: store );
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
            const VideoBgWidget(),
             Scaffold(
                  backgroundColor: Colors.transparent,
                  appBar: null,
                  body: state.activeScreen == AppScreenEnums.LOADING_SCREEN
                        && state.userRefreshToken == ''

                            ? const Center( child: BenekLoadingComponent() )
                            : state.activeScreen == AppScreenEnums.LOGIN_SCREEN

                                // ignore: prefer_const_constructors
                                ? LoginScreen() // Login Screen
                                : store.state.activeScreen == AppScreenEnums.HOME_SCREEN

                                      ? const SizedBox() // HomeScreen( store: store)
                                      : store.state.activeScreen == AppScreenEnums.ERROR_SCREEN

                                          ? const SizedBox() // ErrorScreen( store: store, )
                                          : const SizedBox()
                ),
          ],
        );
      }
    );
  }
}