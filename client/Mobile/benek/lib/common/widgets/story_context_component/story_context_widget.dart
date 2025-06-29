import 'dart:math' as MainAxisSize;

import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/common/widgets/story_context_component/comments_component/comment_card.dart';
import 'package:benek/common/widgets/story_context_component/story_desc_widget.dart';
import 'package:benek/common/widgets/story_context_component/story_like_info_card_widget.dart';
import 'package:benek/data/models/story_models/story_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';

import '../../../data/models/content_models/comment_model.dart';
import '../../../redux/get_story_comment_replies/get_story_comment_replies.action.dart';
import 'comments_component/comments_component.dart';
import 'comments_component/leave_comment_component.dart';
import 'package:benek/store/app_state.dart';

class StoryContextWidget extends StatefulWidget {
  final StoryModel story;
  final Function()? closeFunction;

  const StoryContextWidget({
    super.key,
    required this.story,
    this.closeFunction,
  });

  @override
  State<StoryContextWidget> createState() => _StoryContextWidgetState();
}

class _StoryContextWidgetState extends State<StoryContextWidget> {
  CommentModel? selectedComment;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min, // ⚡️ ÇOK ÖNEMLİ
                children: [
                  StoryDescWidget(
                    profileImg: widget.story.user?.profileImg,
                    desc: widget.story.desc,
                    about: widget.story.about,
                    createdAt: BenekStringHelpers.getDateAsString(widget.story.createdAt!),
                  ),
                  const SizedBox(height: 20.0),
                  StoryLikeInfoCardWidget(
                    storyId: widget.story.storyId!,
                    closeFunction: widget.closeFunction,
                  ),
                  const SizedBox(height: 20.0),
                  if (selectedComment != null)
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.benekBlack,
                        borderRadius: BorderRadius.circular(6.0),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                      child: CommentCardWidget(
                        isSelectedComment: true,
                        resetSelectedCommentFunction: () async {
                          String selectedCommentId = selectedComment!.id!;
                          setState(() {
                            selectedComment = null;
                          });
                          await StoreProvider.of<AppState>(context).dispatch(
                            resetStoryCommentRepliesAction(
                              widget.story.storyId!,
                              selectedCommentId,
                            ),
                          );
                        },
                        commentId: selectedComment!.id!,
                        storyId: widget.story.storyId!,
                      ),
                    ),
                  const SizedBox(height: 20.0),
                  CommentsComponent(
                    selectedStoryId: widget.story.storyId!,
                    selectedComment: selectedComment,
                    selectCommentFunction: (String commentId) async {
                      CommentModel comment = widget.story.comments!.firstWhere(
                        (comment) => comment.id == commentId,
                      );

                      await StoreProvider.of<AppState>(context).dispatch(
                        resetStoryCommentRepliesAction(
                          widget.story.storyId!,
                          comment.id!,
                        ),
                      );

                      setState(() {
                        selectedComment = comment;
                      });

                      await StoreProvider.of<AppState>(context).dispatch(
                        getStoryCommentRepliesRequestAction(
                          widget.story.storyId!,
                          comment.id!,
                          null,
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          AnimatedPadding(
            duration: const Duration(milliseconds: 200),
            padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
            child: LeaveCommentComponent(
              storyId: widget.story.storyId!,
              selectedCommentId: selectedComment?.id,
            ),
          ),
        ],
      ),
    );
  }
}
