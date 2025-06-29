import 'package:benek/common/constants/app_colors.dart';
import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/data/models/content_models/comment_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek/store/app_state.dart';
import '../../../../data/models/story_models/story_model.dart';
import '../../../utils/styles.text.dart';
import 'comments_list.dart';

class CommentsComponent extends StatelessWidget {
  final CommentModel? selectedComment;
  final String selectedStoryId;
  final Function(String commentId)? selectCommentFunction;

  const CommentsComponent({
    super.key,
    this.selectedComment,
    required this.selectedStoryId,
    this.selectCommentFunction,
  });

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, StoryModel?>(
      converter: (store) {
        return store.state.storiesToDisplay?.firstWhere(
                (story) => story.storyId == selectedStoryId,
            orElse: () => StoryModel()
        );
      },
      builder: (context, story) {
        return Container(
          decoration: const BoxDecoration(
            color: AppColors.benekBlack,
            borderRadius: BorderRadius.all(Radius.circular(6.0)),
          ),
          padding: const EdgeInsets.all(10.0),
          child: story != null
              && (
                (
                  selectedComment == null
                  && (story.commentCount ?? 0) > 0
                )
                || (
                  selectedComment != null
                  && story.comments != null
                  && (story.comments![
                        story.comments!.indexWhere(
                          (comment) =>
                            comment.id == selectedComment!.id
                        )
                  ].replyCount ?? 0) > 0
                )
              )
              && (
                (
                  selectedComment == null
                  && (
                    story.comments == null
                    || story.comments!.isNotEmpty
                  )
                )
                || (
                  selectedComment != null
                  && story.comments != null
                  && story.comments!.isNotEmpty
                  && (
                      story.comments![
                            story.comments!.indexWhere(
                              (comment) =>
                                comment.id == selectedComment!.id
                            )
                      ].replies == null

                      || story.comments![
                            story.comments!.indexWhere(
                              (comment) =>
                                comment.id == selectedComment!.id
                            )
                      ].replies!.isNotEmpty
                  )
                )
              )
                ? CommentsList(
                  storyId: selectedStoryId,
                  totalCommentCount: selectedComment == null
                      ? story.commentCount ?? 0
                      : story.comments![
                          story.comments!.indexWhere(
                            (comment) => comment.id == selectedComment!.id
                          )
                      ].replyCount ?? 0,
                  commentList: story.comments,
                  selectedComment: selectedComment,
                  selectCommentFunction: selectCommentFunction,
                )
                : Padding(
                  padding: const EdgeInsets.symmetric(vertical: 114.0),
                  child: Center(
                    child: Text(
                      selectedComment == null
                          ? BenekStringHelpers.locale('commentEmptyState')
                          : BenekStringHelpers.locale('replyEmptyState'),
                      style: regularTextStyle(textColor: AppColors.benekWhite),
                    ),
                  ),
                ),
        );
      },
    );
  }
}
