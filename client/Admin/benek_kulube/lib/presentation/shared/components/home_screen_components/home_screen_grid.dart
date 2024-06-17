import 'dart:developer';

import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_home_tab/home_screen_home_tab.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/home_screen_profile_tab.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_bar/user_search_bar_buton.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'home_screen_tabs/home_screen_right_tabs/home_screen_home_right_bar/home_screen_home_right_bar.dart';
import 'home_screen_tabs/home_screen_right_tabs/home_screen_home_right_bar/home_screen_profile_right_tab.dart';
import 'home_screen_tabs_bar_companents/home_screen_tabs_bar.dart';

class HomeScreenGrid extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreenGrid({
    super.key,
    required this.store
  });

  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [


          // Left Tab
          // =====================================================
          HomeScreenTabsBar( store: store,),


          // Center Tab
          // =====================================================
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Expanded(
                child: SizedBox(
                  width: 600,
                  child: ScrollConfiguration(
                    behavior: ScrollConfiguration.of(context).copyWith(
                      scrollbars: false,
                      overscroll: false,
                      physics: const BouncingScrollPhysics(),
                    ),
                    child: ListView(
                      shrinkWrap: true,
                      physics: store.state.selectedUserInfo == null
                          ? const NeverScrollableScrollPhysics()
                          : const BouncingScrollPhysics(),
                      children: [
                        const KulubeSearchBarButon(),
                        const SizedBox( height: 100 ),
                        store.state.selectedUserInfo == null
                          ? KulubeHomeTabWidget(
                              firstName: store.state.userInfo!.identity!.firstName!,
                              middleName: store.state.userInfo!.identity!.middleName,
                              lastName: store.state.userInfo!.identity!.lastName!,
                            )
                          : const ProfileTab()
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),


          // Right Tab
          // =====================================================
          store.state.selectedUserInfo == null
            ? HomeScreenHomeRightTab( profileImg: store.state.userInfo!.profileImg! )
            : const HomeScreenProfileRightTab(),


        ],
      );
  }
}