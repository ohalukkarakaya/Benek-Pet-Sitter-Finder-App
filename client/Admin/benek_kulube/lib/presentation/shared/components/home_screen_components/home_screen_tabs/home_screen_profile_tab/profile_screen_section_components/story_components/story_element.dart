import 'dart:developer';

import 'package:benek_kulube/presentation/features/image_video_helpers/image_video_helpers.dart';
import 'package:benek_kulube/presentation/shared/components/benek_circle_avatar/benek_circle_avatar.dart';
import 'package:flutter/material.dart';

import '../../../../../../../../common/constants/app_colors.dart';
import '../../../../../../../../common/utils/styles.text.dart';
import '../../../../../../../../data/models/story_models/story_model.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

class StoryElement extends StatefulWidget {
  final void Function(dynamic Function() selectStoryFunction, List<StoryModel>? stories, int index) onTapPageBuilder;
  final int index;
  final List<StoryModel>? stories;
  final StoryModel? story;
  const StoryElement({
    super.key,
    required this.onTapPageBuilder,
    required this.index,
    this.stories,
    this.story
  });

  @override
  State<StoryElement> createState() => _StoryElementState();
}

class _StoryElementState extends State<StoryElement> {

  bool isHovered = false;

  @override
  Widget build(BuildContext context) {

    const Size containerSize = Size(125, 250);
    Store<AppState> store = StoreProvider.of<AppState>(context);

    return MouseRegion(
      onHover: (_) {
        setState(() {
          isHovered = true;
        });
      },
      onExit: (_) {
        setState(() {
          isHovered = false;
        });
      },
      child: GestureDetector(
        onTap: () => widget.onTapPageBuilder(
            () async {
              await store.dispatch(IncreaseProcessCounterAction());
              await store.dispatch(resetStoryCommentsAction(widget.story!.storyId));
              store.dispatch(getStoryCommentsByStoryIdRequestAction(widget.story!.storyId, null));
              await store.dispatch(selectStoryAction(widget.story!));
              await store.dispatch(DecreaseProcessCounterAction());
            },
            widget.stories,
            widget.index
        ),
        child: Padding(
            padding: const EdgeInsets.all( 8.0 ),
            child: ClipRRect(
              borderRadius: const BorderRadius.all( Radius.circular( 6.0 ) ),
              child: Stack(
                children: [
                  SizedBox(
                    width: containerSize.width,
                    height: containerSize.height,
                    child: widget.story != null
                      && widget.story!.contentUrl != null
                        ? ImageVideoHelpers.getThumbnail( widget.story!.contentUrl! )
                        : const SizedBox(),
                  ),

                  Container(
                    width: containerSize.width,
                    height: containerSize.height,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.bottomCenter,
                        end: Alignment.topCenter,
                        colors: [
                          AppColors.benekBlack.withOpacity(1),
                          !isHovered
                          || widget.story == null
                            ? AppColors.benekBlack.withOpacity(0.0)
                            : AppColors.benekBlack.withOpacity(0.5),
                        ],
                      ),
                    ),
                  ),

                  widget.story != null
                  && widget.story!.about != null
                  && widget.story!.about!.pet != null
                  ? Positioned(
                      left: 7,
                      bottom: 7,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          BenekCircleAvatar(
                              width: 20,
                              height: 20,
                              borderWidth: 2.0,
                              isDefaultAvatar: widget.story!.about!.pet!.petProfileImg!.isDefaultImg!,
                              imageUrl: widget.story!.about!.pet!.petProfileImg!.imgUrl!
                          ),
                          const SizedBox(width: 5,),
                          SizedBox(
                            width: 75,
                            child: Text(
                              widget.story!.about!.pet!.name!,
                              style: mediumTextWithoutColorStyle(),
                              overflow: TextOverflow.fade,
                            ),
                          ),
                        ],
                      ),
                    )
                  : const SizedBox(),
                ],
              ),
            )
        ),
      ),
    );;
  }
}
