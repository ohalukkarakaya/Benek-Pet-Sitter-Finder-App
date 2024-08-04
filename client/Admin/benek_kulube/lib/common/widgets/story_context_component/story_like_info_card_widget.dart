import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/styles.text.dart';
import 'package:benek_kulube/common/widgets/approve_screen.dart';
import 'package:benek_kulube/common/widgets/benek_like_button/like_buton.dart';
import 'package:benek_kulube/common/widgets/story_context_component/story_first_five_liked_user_stacked_widget.dart';
import 'package:benek_kulube/data/models/story_models/story_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../data/models/user_profile_models/user_info_model.dart';
import '../../constants/benek_icons.dart';

class StoryLikeInfoCardWidget extends StatefulWidget {
  final String storyId;
  final Function()? closeFunction;

  const StoryLikeInfoCardWidget({
    super.key,
    required this.storyId,
    this.closeFunction
  });

  @override
  State<StoryLikeInfoCardWidget> createState() => _StoryLikeInfoCardWidgetState();
}

class _StoryLikeInfoCardWidgetState extends State<StoryLikeInfoCardWidget> {

  bool stateUpdated = false;
  bool isIconHovered = false;

  Future<bool?> onLikeButtonTapped(bool isLiked) async {
    Store<AppState> store = StoreProvider.of<AppState>(context);
    await store.dispatch(likeStoryAction(widget.storyId));

    setState(() {
      stateUpdated = !stateUpdated;
    });

    return !isLiked;
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    StoryModel story = store.state.storiesToDisplay!.firstWhere((element) => element.storyId == widget.storyId);
    bool _isLiked = story.didUserLiked ?? false;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        story.user!.userId == store.state.userInfo!.userId
          ? MouseRegion(
            cursor: SystemMouseCursors.click,
            onHover: (_) {
              setState(() {
                isIconHovered = true;
              });
            },
            onExit: (_) {
              setState(() {
                isIconHovered = false;
              });
            },
            child: Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
                decoration: BoxDecoration(
                  color: !isIconHovered ? AppColors.benekBlack : AppColors.benekRed,
                  borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
                ),
                child: IconButton(
                    onPressed: () async {
                      bool didApprove = await Navigator.push(
                        context,
                        PageRouteBuilder(
                          opaque: false,
                          barrierDismissible: false,
                          pageBuilder: (context, _, __) => ApproveScreen(title: BenekStringHelpers.locale('approveStoryDelete')),
                        ),
                      );

                      if(didApprove != true) return;

                      await store.dispatch(deleteStoryByStoryIdRequestAction(widget.storyId));
                      widget.closeFunction?.call();
                    },
                    icon: const Icon(
                      Icons.delete_outline,
                      color: AppColors.benekWhite,
                      size: 20,

                    )
                ),
              ),
            ),
          ) : const SizedBox(),

        Container(
          decoration: const BoxDecoration(
            color: AppColors.benekBlack,
            borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SizedBox(
                width: 150,
                height: 35,
                child: StoryFirstFiveLikedUserStackedWidget(
                  totalLikeCount: story.likeCount ?? 0,
                  users: story.firstFiveLikedUser ?? <UserInfo>[],
                )
              ),
              Text(
                '${BenekStringHelpers.formatNumberToReadable(story.likeCount ?? 0)} ${BenekStringHelpers.locale('peopleLiked')}',
                style: lightTextStyle( textColor: AppColors.benekWhite ),
              ),

              const SizedBox(width: 25),

              MouseRegion(
                cursor: SystemMouseCursors.click,
                child: LikeButton(
                  size: 25,
                  isLiked: _isLiked,
                  onTap: onLikeButtonTapped,
                  likeBuilder: (isLiked) {
                    return Icon(
                      isLiked ? Icons.favorite : Icons.favorite_border,
                      color: isLiked ? AppColors.benekRed : AppColors.benekWhite,
                      size: 25,
                    );
                  }
                ),
              ),
            ],
          )
        ),
      ],
    );
  }
}
