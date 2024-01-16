import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/models/main_observing_states_view_models/main_observing_states_view_models.dart';
import 'package:benek_kulube/presentation/shared/screens/login_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import '../presentation/shared/components/benek_process_indicator/benek_process_indicator.dart';
import '../presentation/shared/components/loading_components/benek_loading_component.dart';
import '../store/app_state.dart';
import '../presentation/features/counter/components/counter_widget.dart';

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
    return StoreConnector<AppState, MainObservingStatesViewModel>(
      converter: (store) {
        return MainObservingStatesViewModel(
          store: store,
          activeScreen: store.state.activeScreen,
          isLoading: store.state.isLoading,
        );
      },
      builder: (BuildContext context, MainObservingStatesViewModel mainObservingStates) {
        if( 
          mainObservingStates.store.state.userRefreshToken == '' 
          && mainObservingStates.store.state.userAccessToken == '' 
          && mainObservingStates.activeScreen == AppScreenEnums.LOADING_SCREEN
        ){ 
          AuthUtils.setCredentials( mainObservingStates.store );
        }
        
        return Stack(
          children: [
             Scaffold(
                  backgroundColor: Colors.transparent,
                  appBar: AppBar( backgroundColor: Colors.transparent, ),
                  body: mainObservingStates.activeScreen == AppScreenEnums.LOADING_SCREEN
                        && mainObservingStates.store.state.userRefreshToken == ''

                            ? const Center( child: BenekLoadingComponent() )

                            : mainObservingStates.activeScreen == AppScreenEnums.LOGIN_SCREEN

                                ? LoginScreen( store: mainObservingStates.store )

                                : mainObservingStates.activeScreen == AppScreenEnums.HOME_SCREEN

                                      ? Row(
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
                                      )

                                      : const SizedBox()
                )

              // mainObservingStates.isLoading
              //   ? const BenekLoadingWidget()
              //   : const SizedBox(),
          ],
        );
      }
    );
  }
}