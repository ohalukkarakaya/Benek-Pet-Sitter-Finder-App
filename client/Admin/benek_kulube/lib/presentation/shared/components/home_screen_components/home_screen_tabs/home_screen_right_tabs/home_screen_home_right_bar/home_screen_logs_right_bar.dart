import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek_kulube/store/app_state.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/actions/app_actions.dart';

import '../../../../../../../data/models/user_profile_models/user_info_model.dart';
import '../../../../benek_circle_avatar/benek_circle_avatar.dart';

class HomeScreenLogsRightTab extends StatelessWidget {
  final UserInfo user;
  const HomeScreenLogsRightTab({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Padding(
            padding: const EdgeInsets.only(
                right: 40.0,
                top: 50.0,
                bottom: 70.0
            ),
            child: GestureDetector(
              onTap: () async {
                Store<AppState> store = StoreProvider.of<AppState>(context);
                if( store.state.selectedUserInfo != null ){
                  await store.dispatch(setSelectedUserAction(null));
                }
                await store.dispatch(setSelectedUserAction(user));
              },
              child: MouseRegion(
                cursor: SystemMouseCursors.click,
                child: BenekCircleAvatar(
                  width: 50,
                  height: 50,
                  radius: 100,
                  isDefaultAvatar: user.profileImg!.isDefaultImg!,
                  imageUrl: user.profileImg!.imgUrl!,
                ),
              ),
            )
        ),
      ],
    );
  }
}
