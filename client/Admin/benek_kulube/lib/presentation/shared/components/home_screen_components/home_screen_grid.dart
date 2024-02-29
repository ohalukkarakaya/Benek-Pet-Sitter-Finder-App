import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_home_tab/home_screen_home_tab.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/home_screen_profile_tab.dart';
import 'package:benek_kulube/presentation/shared/components/user_search_companents/user_search_bar/user_search_bar_buton.dart';
import 'package:flutter/material.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'home_screen_tabs_bar_companents/home_screen_tabs_bar.dart';

class HomeScreenGrid extends StatelessWidget {
  final Store<AppState> store;
  const HomeScreenGrid({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          HomeScreenTabsBar( store: store,),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.start,
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
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Padding(
                padding: const EdgeInsets.only(
                  right: 40.0, 
                  top: 5
                ),
                child: BenekCircleAvatar(
                  width: 50,
                  height: 50,
                  radius: 100,
                  isDefaultAvatar: store.state.userInfo!.profileImg!.isDefaultImg!,
                  imageUrl: store.state.userInfo!.profileImg!.imgUrl!,
                )
              ),
              Image.asset(
                'assets/images/saluting_dog.png',
                width: 350,
              ),
            ],
          ),
        ],
      );
  }
}