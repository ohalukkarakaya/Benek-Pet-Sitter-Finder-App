import 'dart:ui';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/benek_message_box_widget/benek_message_box_triangle_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/care_giver_badge.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/story_components/kulube_stories_board.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_adress_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_bio_widget.dart';
import 'package:benek_kulube/presentation/shared/components/home_screen_components/home_screen_tabs/home_screen_profile_tab/profile_screen_section_components/profile_row.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:el_tooltip/el_tooltip.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:shimmer/shimmer.dart';

import '../../../../../../common/constants/app_colors.dart';
import '../../../../../../common/constants/benek_icons.dart';
import '../../../../../../common/widgets/benek_message_box_widget/benek_message_box_widget.dart';
import '../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../benek_avatar_grid/benek_avatar_grid_widget.dart';
import 'benek_profile_stars_widget/benek_profile_star_widget.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  bool didRequestSend = false;
  Size storyBoardSize = const Size(540, 250);

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      Store<AppState> store = StoreProvider.of<AppState>(context);
      if( !didRequestSend ){
        didRequestSend = true;
        await store.dispatch(getUserInfoByUserIdAction( store.state.selectedUserInfo!.userId! ));
        await store.dispatch(getStoriesByUserIdRequestAction( store.state.selectedUserInfo!.userId! ));
        await store.dispatch(getPetsByUserIdRequestAction( store.state.selectedUserInfo!.userId! ));
      }
      updateStoryBoardSize();
    });
  }

  void updateStoryBoardSize() {
    setState(() {
      storyBoardSize = calculateStoryBoardSize(); // storyBoardSize'ı güncellemek için setState() kullandık
    });
  }

  Size calculateStoryBoardSize() {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    return Size(
      store.state.storiesToDisplay != null && store.state.storiesToDisplay!.isNotEmpty && store.state.storiesToDisplay!.length < 5
          ? store.state.storiesToDisplay!.length * 155.0
          : 540,
      store.state.storiesToDisplay != null && store.state.storiesToDisplay!.isEmpty ? 150 : 250,
    );
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, UserInfo?>(
        converter: (Store<AppState> store) => store.state.selectedUserInfo,
        builder: (BuildContext context, UserInfo? selectedUserInfo) {
          bool isCareGiver = selectedUserInfo!.isCareGiver != null && selectedUserInfo.isCareGiver!;
          return Container(
            padding: const EdgeInsets.only(left: 60.0, bottom: 20.0),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    BenekMessageBoxWidget(
                      size: storyBoardSize,
                      child: const KulubeStoriesBoard(),
                    ),
                  ],
                ),

                ProfileRowWidget(selectedUserInfo: selectedUserInfo),
                selectedUserInfo != null
                && selectedUserInfo.identity != null
                && selectedUserInfo.identity!.bio != null
                    ? Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        ProfileBioWidget(text: '" ${selectedUserInfo.identity!.bio!} "',),
                      ],
                    )
                    : const SizedBox(),

                Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      ProfileAdressWidget(
                        location: selectedUserInfo.location,
                      ),

                      BenekProfileStarWidget(
                        star: selectedUserInfo.stars ?? 0,
                        starCount: selectedUserInfo.totalStar ?? 0,
                      ),

                      CareGiverBadge(isCareGiver: isCareGiver),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 20.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      BenekAvatarGridWidget(
                          list: selectedUserInfo.pets ?? [],
                          emptyMessage: BenekStringHelpers.locale('noPets'),
                          shouldEnableShimmer: selectedUserInfo != null
                                               && selectedUserInfo.pets != null
                                               && selectedUserInfo.pets!.isNotEmpty
                                               && selectedUserInfo.pets![0] is String,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        }
    );
  }
}