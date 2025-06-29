import 'package:benek/presentation/shared/components/home_screen_components/home_screen_profile_tab/home_screen_profile_tab.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:benek/store/app_state.dart';
import 'package:benek/presentation/shared/components/home_screen_components/user_search_companents/user_search_bar/user_search_bar_buton.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    final Store<AppState> store = AppReduxStore.getInitialStore();

    return StoreConnector<AppState, AppState>(
      converter: (Store<AppState> store) => store.state,
      builder: (context, state) {
        return Scaffold(
          backgroundColor: Colors.transparent,
          body: SafeArea(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ✅ Mobil uyumlu konumda buton
                  const KulubeSearchBarButon(
                    shouldGivePaddingToTop: false,
                  ),
                  const SizedBox(height: 20),

                  state.selectedUserInfo != null
                      ? const ProfileTab()
                      : const SizedBox(),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}