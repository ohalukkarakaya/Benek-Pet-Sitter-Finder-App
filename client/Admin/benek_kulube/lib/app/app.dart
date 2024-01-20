import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/constants/tabs_enum.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/presentation/shared/components/loading_components/benek_blured_modal_barier.dart';
import 'package:benek_kulube/presentation/shared/screens/login_screen.dart';
import 'package:benek_kulube/presentation/shared/screens/user_search_screen.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import '../presentation/shared/components/loading_components/benek_loading_component.dart';
import '../presentation/shared/screens/home_screen.dart';
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
          fontFamily: 'Qanelas',
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
    return StoreConnector<AppState, AppState>(
      converter: (store) => store.state,
      builder: (BuildContext context, AppState state) {
        var store = StoreProvider.of<AppState>( context );
        AppReduxStore.currentStore = store;
        if( 
          state.userRefreshToken == '' 
          && state.userAccessToken == '' 
          && state.activeScreen == AppScreenEnums.LOADING_SCREEN
        ){ 
          AuthUtils.setCredentials();
        }
        
        return Stack(
          children: [
             Scaffold(
                  backgroundColor: Colors.transparent,
                  appBar: AppBar( backgroundColor: Colors.transparent, ),
                  body: state.activeScreen == AppScreenEnums.LOADING_SCREEN
                        && state.userRefreshToken == ''

                            ? const Center( child: BenekLoadingComponent() )
                            : state.activeScreen == AppScreenEnums.LOGIN_SCREEN

                                ? LoginScreen()
                                : store.state.activeScreen == AppScreenEnums.HOME_SCREEN

                                      ? HomeScreen( store: store)
                                      : const SizedBox()
                ),
          ],
        );
      }
    );
  }
}