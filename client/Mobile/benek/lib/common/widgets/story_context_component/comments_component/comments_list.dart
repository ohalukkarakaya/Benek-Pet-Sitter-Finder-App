import 'dart:developer';

import 'package:benek/common/widgets/story_context_component/comments_component/comment_loading_element.dart';
import 'package:flutter/material.dart';

import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';
import 'package:visibility_detector/visibility_detector.dart';

import '../../../../data/models/content_models/comment_model.dart';
import '../../../../data/models/story_models/story_model.dart';
import '../../../../redux/get_story_comment_replies/get_story_comment_replies.action.dart';
import '../../../../redux/get_story_comments/get_story_comments_by_story_id.action.dart';
import '../../../../redux/process_counter/process_counter.action.dart';
import 'comment_card.dart';

class CommentsList extends StatefulWidget {
  final int totalCommentCount;
  final String storyId;
  final List<CommentModel>? commentList;
  final CommentModel? selectedComment;
  final Function( String commentId )? selectCommentFunction;

  const CommentsList({
    super.key,
    required this.totalCommentCount,
    this.commentList,
    required this.storyId,
    this.selectedComment,
    this.selectCommentFunction,
  });

  @override
  State<CommentsList> createState() => _CommentsListState();
}

class _CommentsListState extends State<CommentsList> {
  bool shouldSendPaginationRequest = false; //pagination request controlling state
  bool isWaitingForAsyncRequest = false; //we make it true after we send request and we dont want to send new one because it is gonna be duplicate

  void checkIfPaginationNeeded(Store<AppState> store, int? index) {
    if (_isPaginationNeeded(store, index) && !isWaitingForAsyncRequest) {
      setState(() {
        shouldSendPaginationRequest = true;
      });
    }
  }

  bool _isPaginationNeeded(Store<AppState> store, int? index) {
    return ( index != null && index >= widget.commentList!.length - 3)
      && widget.totalCommentCount > widget.commentList!.length;
  }

  void requestNextPageIfNeeded(Store<AppState> store) {
    if (shouldSendPaginationRequest) {
      setState(() {
        shouldSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      // Send Request
      getRecomendedCommentsNextPageRequest(() {
        setState(() {
          isWaitingForAsyncRequest = false;
        });
      }, store);
    }
  }

  Future<void> getRecomendedCommentsNextPageRequest( Function? callBackAfterRequestDone, Store<AppState> store) async {

    if( widget.commentList == null ){
      return null;
    }

    await store.dispatch(IncreaseProcessCounterAction());

    StoryModel? story = store.state.storiesToDisplay!.firstWhere(
          (element) => element.storyId == widget.storyId,
    );

    if (widget.selectedComment == null) {
      // send pagination request for comments
      log('PAGINATION Request for Comments');

      List<CommentModel>? commentList = story.comments!;

      CommentModel lastComment = commentList.firstWhere(
        (element) => element.isLastItem!,
      );

      await store.dispatch(getStoryCommentsByStoryIdRequestAction(
        store.state.selectedStory!.storyId,
        lastComment.id!,
      ));
    } else {
      // send pagination request for replies
      log('PAGINATION Request for Replies');

      List<CommentModel>? replyList = widget.selectedComment!.replies;

      CommentModel lastReply = replyList!.firstWhere(
        (element) => element.isLastItem!,
      );

      await store.dispatch(getStoryCommentRepliesRequestAction(
        store.state.selectedStory!.storyId!,
        widget.selectedComment!.id!,
        lastReply.id!,
      ));
    }

    if (callBackAfterRequestDone != null && mounted) {
      callBackAfterRequestDone();
    }

    await store.dispatch(DecreaseProcessCounterAction());
  }

  Widget _buildCommentCard(int index) {
    return CommentCardWidget(
      selectCommentFunction: widget.selectedComment == null
          ? () => widget.selectCommentFunction!( widget.commentList![ index ].id! )
          : null,
      replyId: widget.selectedComment != null ? widget.commentList![ widget.commentList!.indexWhere((element) => element.id == widget.selectedComment!.id) ].replies![ index ].id : null,
      commentId: widget.selectedComment != null ? widget.selectedComment!.id! : widget.commentList![ index ].id!,
      storyId: widget.storyId,
    );
  }

  Widget _buildVisibilityDetector(Widget child, int index) {
    return VisibilityDetector(
      key: Key(index.toString()),
      onVisibilityChanged: (visibilityInfo) {
        if (mounted) {
          checkIfPaginationNeeded(StoreProvider.of<AppState>(context), index);
        }
      },
      child: child,
    );
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    checkIfPaginationNeeded(store, null);
    requestNextPageIfNeeded(store);

    return Column(
      children: List.generate(
          widget.commentList != null && widget.selectedComment == null
             ? widget.commentList!.length
             : widget.commentList != null && widget.selectedComment != null && widget.commentList![ widget.commentList!.indexWhere( (element) => element.id == widget.selectedComment!.id ) ].replies != null
                  ? widget.commentList![ widget.commentList!.indexWhere( (element) => element.id == widget.selectedComment!.id ) ].replies!.length
                  : widget.totalCommentCount > 2
                         ? 2
                         : widget.totalCommentCount,
          (index) {
            return (
                (
                  widget.selectedComment == null
                  && widget.commentList != null
                  && widget.commentList?[ index ] != null
                )
                || (
                  widget.selectedComment != null
                  && widget.commentList != null
                  && widget.commentList?[ index ] != null
                  && widget.commentList![ widget.commentList!.indexWhere( (element) => element.id == widget.selectedComment!.id ) ].replies != null
                  && widget.commentList![ widget.commentList!.indexWhere( (element) => element.id == widget.selectedComment!.id ) ].replies![ index ] != null
                )
            )
              ? _buildVisibilityDetector(
                  _buildCommentCard(index),
                  index,
                )
              : CommentLoadingElement( isReply: widget.selectedComment != null);
          }
      ),
    );
  }
}
