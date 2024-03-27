import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_adress_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_bio_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_row.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:el_tooltip/el_tooltip.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import '../../../../../../common/constants/app_colors.dart';
import '../../../../../../common/constants/benek_icons.dart';
import 'benek_profile_stars_widget/benek_profile_star_widget.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  bool didRequestSend = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);
      if( !didRequestSend ){
        didRequestSend = true;
        await store.dispatch(getUserInfoByUserIdAction( store.state.selectedUserInfo!.userId! ));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    bool isCareGiver = store.state.selectedUserInfo!.isCareGiver != null && store.state.selectedUserInfo!.isCareGiver!;
    return SingleChildScrollView(
      child: Container(
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
                  const ProfileAdressWidget(),
      
                  store.state.selectedUserInfo!.stars != null && store.state.selectedUserInfo!.totalStar != null
                  ? BenekProfileStarWidget(
                      star: store.state.selectedUserInfo!.stars!,
                      starCount: store.state.selectedUserInfo!.totalStar!,
                    )
                  : const SizedBox(),

                  CareGiverBadge(isCareGiver: isCareGiver),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}