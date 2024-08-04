import 'dart:developer';

import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import '../../../../data/models/story_models/story_model.dart';
import '../../../utils/styles.text.dart';
import 'comments_list.dart';

class CommentsComponent extends StatelessWidget {
  final bool isReply;
  final String selectedStoryId;
  final Function(CommentModel comment)? selectCommentFunction;

  const CommentsComponent({
    super.key,
    this.isReply = false,
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
              && (story.commentCount ?? 0) > 0
              && (story.comments == null || story.comments!.isNotEmpty)
                ? CommentsList(
                  storyId: selectedStoryId,
                  totalCommentCount: story.commentCount ?? 0,
                  commentList: story.comments,
                  isCommentList: !isReply,
                )
                : Padding(
                  padding: const EdgeInsets.symmetric(vertical: 114.0),
                  child: Center(
                    child: Text(
                      BenekStringHelpers.locale('commentEmptyState'),
                      style: regularTextStyle(textColor: AppColors.benekWhite),
                    ),
                  ),
                ),
        );
      },
    );
  }
}
