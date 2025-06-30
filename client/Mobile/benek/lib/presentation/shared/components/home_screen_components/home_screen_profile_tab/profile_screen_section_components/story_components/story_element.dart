import 'package:benek/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../data/models/story_models/story_model.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_state.dart';

class StoryElement extends StatelessWidget {
  final void Function(dynamic Function() selectStoryFunction,
      List<StoryModel>? stories, int index) onTapPageBuilder;
  final int index;
  final List<StoryModel>? stories;
  final StoryModel? story;
  const StoryElement({
    super.key,
    required this.onTapPageBuilder,
    required this.index,
    this.stories,
    this.story,
  });

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.of(context).size.width * 0.3;
    final double height = MediaQuery.of(context).size.height * 0.25;

    Store<AppState> store = StoreProvider.of<AppState>(context);

    return GestureDetector(
      onTap: () => onTapPageBuilder(
        () async {
          await store.dispatch(IncreaseProcessCounterAction());
          await store.dispatch(resetStoryCommentsAction(story!.storyId));
          store.dispatch(
              getStoryCommentsByStoryIdRequestAction(story!.storyId, null));
          await store.dispatch(selectStoryAction(story!));
          await store.dispatch(DecreaseProcessCounterAction());
        },
        stories,
        index,
      ),
      child: Container(
        width: width,
        height: height,
        margin: const EdgeInsets.all(
            8), // <— köşe dışında kalacağı için kırpılmayacak
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8), // tek yerde yarıçap
        ),
        clipBehavior: Clip.hardEdge, // <— çocukları kırpar
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (story?.contentUrl != null)
              ImageVideoHelpers.getThumbnail(story!.contentUrl!),
            Container(
              // gradient overlay
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    AppColors.benekBlack,
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            if (story?.about?.pet != null)
              Positioned(
                left: 7,
                bottom: 7,
                child: Row(
                  children: [
                    BenekCircleAvatar(
                      width: 20,
                      height: 20,
                      borderWidth: 2,
                      isDefaultAvatar:
                          story!.about!.pet!.petProfileImg!.isDefaultImg!,
                      imageUrl: story!.about!.pet!.petProfileImg!.imgUrl!,
                    ),
                    const SizedBox(width: 5),
                    SizedBox(
                      width: width * 0.5,
                      child: Text(
                        story!.about!.pet!.name!,
                        style: mediumTextWithoutColorStyle(),
                        overflow: TextOverflow.fade,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
