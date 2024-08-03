import 'dart:developer';

import 'package:benek_kulube/common/widgets/story_context_component/comments_component/comment_loading_element.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:visibility_detector/visibility_detector.dart';

import '../../../../data/models/content_models/comment_model.dart';
import 'comment_card.dart';

class CommentsList extends StatefulWidget {
  final int totalCommentCount;
  final List<CommentModel>? commentList;
  final bool isCommentList; // it also can be comment reply list

  const CommentsList({
    super.key,
    required this.totalCommentCount,
    this.commentList,
    this.isCommentList = false,
  });

  @override
  State<CommentsList> createState() => _CommentsListState();
}

class _CommentsListState extends State<CommentsList> {
  bool shoudSendPaginationRequest = false; //pagination request controlling state
  bool isWaitingForAsyncRequest = false; //we make it true after we send request and we dont want to send new one because it is gonna be duplicate

  void checkIfPaginationNeeded(Store<AppState> store, int? index) {
    if (_isPaginationNeeded(store, index) && !isWaitingForAsyncRequest) {
      setState(() {
        shoudSendPaginationRequest = true;
      });
    }
  }

  bool _isPaginationNeeded(Store<AppState> store, int? index) {
    return (
        index != null && index == widget.commentList!.length - 3
    ) && widget.totalCommentCount > widget.commentList!.length;
  }

  void requestNextPageIfNeeded(Store<AppState> store) {
    if (shoudSendPaginationRequest) {
      setState(() {
        shoudSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      // Send Request
      getRecomendedUsersNextPageRequest(() {
        setState(() {
          isWaitingForAsyncRequest = false;
        });
      }, store);
    }
  }

  Future<void> getRecomendedUsersNextPageRequest(
      Function? callBackAfterRequestDone, Store<AppState> store) async {
    if (widget.isCommentList && widget.commentList != null) {
      // TO DO: send pagination request for comments
    } else {
      // send pagination request for replies
    }

    if (callBackAfterRequestDone != null && mounted) {
      callBackAfterRequestDone();
    }
  }

  Widget _buildCommentCard(int index) {
    return CommentCardWidget(
      index: index,
      comment: widget.commentList![index],
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
          widget.commentList != null
             ? widget.commentList!.length
             : widget.totalCommentCount > 6
                 ? 6
                 : widget.totalCommentCount,
          (index) {
            return widget.commentList != null
              && widget.commentList?[ index ] != null
              ? _buildVisibilityDetector(
                  _buildCommentCard(index),
                  index,
                )
              : const CommentLoadingElement();
          }
      ),
    );
  }
}
