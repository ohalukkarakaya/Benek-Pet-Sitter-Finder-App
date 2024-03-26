import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_adress_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_bio_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_row.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../../common/constants/app_colors.dart';
import '../../../../../../common/constants/benek_icons.dart';
import 'benek_profile_stars_widget/benek_profile_star_widget.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    return Container(
      width: 600,
      padding: const EdgeInsets.only(left: 60.0),
      child: Column(
        children: [
          ProfileRowWidget(store: store),
          store.state.selectedUserInfo != null
          && store.state.selectedUserInfo!.identity != null
          && store.state.selectedUserInfo!.identity!.bio != null
            ? ProfileBioWidget(store: store)
            : const SizedBox(),

          Padding(
            padding: const EdgeInsets.only(top: 20.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ProfileAdressWidget(store: store),

                store.state.selectedUserInfo!.stars != null
                && store.state.selectedUserInfo!.totalStar != null
                ? BenekProfileStarWidget(
                    star: store.state.selectedUserInfo!.stars!,
                    starCount: store.state.selectedUserInfo!.totalStar!,
                  )
                : const SizedBox(),

                store.state.selectedUserInfo!.isCareGiver != null && store.state.selectedUserInfo!.isCareGiver!
                    ? Container(
                  padding: const EdgeInsets.all(6.0),
                  decoration: BoxDecoration(
                    color: AppColors.benekBlack.withOpacity(0.2),
                    borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                  ),
                  child: Container(
                      decoration: BoxDecoration(
                          borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                          border: Border.all(
                              color: AppColors.benekWhite,
                              width: 2.0
                          )),
                      padding: const EdgeInsets.only(top: 10.0, bottom: 10.0, left: 9.0, right: 11.0),
                      child: const Icon(
                        BenekIcons.paw,
                        size: 15.0,
                        color: AppColors.benekWhite,
                      )),
                )
                    : const SizedBox(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}