import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/benek_like_button/like_buton.dart';
import 'package:benek_kulube/common/widgets/story_context_component/story_first_five_liked_user_stacked_widget.dart';
import 'package:benek_kulube/data/models/story_models/story_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../data/models/user_profile_models/user_info_model.dart';

class StoryLikeInfoCardWidget extends StatefulWidget {
  final String storyId;

  const StoryLikeInfoCardWidget({
    super.key,
    required this.storyId,
  });

  @override
  State<StoryLikeInfoCardWidget> createState() => _StoryLikeInfoCardWidgetState();
}

class _StoryLikeInfoCardWidgetState extends State<StoryLikeInfoCardWidget> {

  bool stateUpdated = false;

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

    return Container(
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
            style: const TextStyle(
              color: AppColors.benekWhite,
              fontSize: 12.0,
              fontWeight: FontWeight.w300,
              fontFamily: 'Qanelas',
            ),
          ),

          LikeButton(
            size: 25,
            isLiked: _isLiked,
            onTap: onLikeButtonTapped,
            likeBuilder: (isLiked) {
              return Icon(
                isLiked ? Icons.favorite : Icons.favorite_border,
                color: isLiked ? AppColors.benekRed : AppColors.benekGrey,
                size: 25,
              );
            }
          ),
        ],
      )
    );
  }
}
