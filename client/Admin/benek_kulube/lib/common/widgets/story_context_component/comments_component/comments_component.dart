import 'package:benek_kulube/common/constants/app_colors.dart';
import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../data/models/story_models/story_model.dart';
import 'comments_list.dart';

class CommentsComponent extends StatelessWidget {
  final String selectedStoryId;

  const CommentsComponent({
    super.key,
    required this.selectedStoryId
  });

  @override
  Widget build(BuildContext context) {

    Store<AppState> store = StoreProvider.of<AppState>(context);

    StoryModel? story = store.state.storiesToDisplay?.firstWhere(
        (story) =>
            story.storyId == selectedStoryId
    );

    CommentModel? selectedComment;

    return Expanded(
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.benekBlack,
            borderRadius: BorderRadius.all(Radius.circular(6.0),),
          ),
          child: ScrollConfiguration(
            behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
            child: story != null
              && story.comments != null
              && story.comments!.isNotEmpty
                ? CommentsList(
                  totalCommentCount: story.commentCount ?? 0,
                  commentList: story.comments,
                  isCommentList: selectedComment == null
                )
                : const SizedBox(),
          ),
        )
    );
  }
}
