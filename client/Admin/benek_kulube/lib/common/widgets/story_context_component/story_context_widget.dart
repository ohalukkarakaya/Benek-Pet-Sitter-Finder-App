import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/widgets/story_context_component/story_desc_widget.dart';
import 'package:benek_kulube/common/widgets/story_context_component/story_like_info_card_widget.dart';
import 'package:benek_kulube/data/models/story_models/story_model.dart';
import 'package:flutter/widgets.dart';

import '../../../data/models/content_models/comment_model.dart';
import 'comments_component/comments_component.dart';
import 'comments_component/leave_comment_component.dart';

class StoryContextWidget extends StatefulWidget {
  final StoryModel story;
  final Function()? closeFunction;

  const StoryContextWidget({
    super.key,
    required this.story,
    this.closeFunction
  });

  @override
  State<StoryContextWidget> createState() => _StoryContextWidgetState();
}

class _StoryContextWidgetState extends State<StoryContextWidget> {
  CommentModel? selectedComment;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Expanded(
          child: ScrollConfiguration(
            behavior: ScrollConfiguration.of(context).copyWith(
              scrollbars: false,
              overscroll: false,
              physics: const BouncingScrollPhysics(),
            ),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Story description
                  StoryDescWidget(
                    profileImg: widget.story.user?.profileImg,
                    desc: widget.story.desc,
                    about: widget.story.about,
                    createdAt: BenekStringHelpers.getDateAsString(widget.story.createdAt!),
                  ),

                  const SizedBox(height: 20.0),
                  // like info
                  StoryLikeInfoCardWidget(
                      storyId: widget.story.storyId!,
                      closeFunction: widget.closeFunction,
                  ),

                  const SizedBox(height: 20.0),
                  // Story context
                  CommentsComponent(
                    selectedStoryId: widget.story.storyId!,
                    isReply: selectedComment != null,
                    selectCommentFunction: ( CommentModel comment) {
                      setState(() {
                        selectedComment = comment;
                      });
                    },
                  ),
                ]
              ),
            ),
          ),
        ),

        const SizedBox(height: 20.0),

        LeaveCommentComponent(
          storyId: widget.story.storyId!,
          selectedCommentId: selectedComment?.id,
        ),
      ],
    );
  }
}
