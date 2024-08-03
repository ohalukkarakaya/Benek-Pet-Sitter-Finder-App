import 'package:flutter/widgets.dart';
import 'package:flutter_redux/flutter_redux.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/store/app_state.dart';

import '../../../../data/models/content_models/comment_model.dart';
import '../../benek_custom_scroll_list_widget.dart';
import 'comment_card.dart';

class CommentsList extends StatefulWidget {
  final int totalCommentCount;
  final List<CommentModel>? commentList;
  final bool isCommentList; // it also can be comment reply list

  const CommentsList({
    super.key,
    required this.totalCommentCount,
    this.commentList,
    this.isCommentList = false
  });

  @override
  State<CommentsList> createState() => _CommentsListState();
}

class _CommentsListState extends State<CommentsList> {
  int revealAnimationLastIndex = -1; //index of last element which done its animation
  bool shoudSendPaginationRequest = false; //pagination request controlling state
  bool isWaitingForAsyncRequest = false; //we make it true after we send request and we dont want to send new one because it is gonna be duplicate

  void checkIfPaginationNeeded(Store<AppState> store, int? index) {
    if (
    _isPaginationNeeded(store, index)
        && !isWaitingForAsyncRequest
    ){
      // We could send request directly in here but if we do, we gonna need
      // to call requestNextPageIfNeeded function in every where so its better
      // to send one request at main builder and control it by
      // shoudSendPaginationRequest state.
      setState(() {
        shoudSendPaginationRequest = true;
      });
    }
  }

  bool _isPaginationNeeded( Store<AppState> store, int? index ){
    return (
        (
            // we dont pass index data if we call this condition in main builder
            // not in visibility detector.
            index != null
            && index == widget.commentList!.length - 3
        )
    )
        // if there is data waits for us on server :)
        && widget.totalCommentCount > widget.commentList!.length;
  }

  void requestNextPageIfNeeded( Store<AppState> store ){
    if (shoudSendPaginationRequest) {
      // close states so it's not gonna send same request multiple time
      setState(() {
        shoudSendPaginationRequest = false;
        isWaitingForAsyncRequest = true;
      });

      // Send Request
      getRecomendedUsersNextPageRequest(
        () {
          // Function wich gonna be called after request done
          setState(() {
            isWaitingForAsyncRequest = false;
          });
        },
        // Pass store data
        store
      );
    }
  }

  Future<void> getRecomendedUsersNextPageRequest(
      Function? callBackAfterRequestDone,
      Store<AppState> store
      ) async {
    if(
        widget.isCommentList
        && widget.commentList != null
    ){
      // TO DO: send pagination request for comments
    }else{
      // send pagination request for replies
    }

    // TO DO: use after request function
    if( callBackAfterRequestDone != null && mounted ){
      callBackAfterRequestDone();
    }
  }

  Widget _buildCommentCard( int index ){
    return CommentCardWidget(
      index: index,
      indexOfLastRevealedItem: revealAnimationLastIndex,
      comment: widget.isCommentList
          ? widget.commentList![index]
          : widget.commentList![index],
    );
  }

  @override
  Widget build(BuildContext context) {
    Store<AppState> store = StoreProvider.of<AppState>(context);

    checkIfPaginationNeeded(store, null);
    requestNextPageIfNeeded( store );

    return BenekCustomScrollListWidget(
      itemDataList: widget.commentList,
      child: (index) => _buildCommentCard(index),
      onVisibilityChangedCB: (visibilityInfo, index){
        checkIfPaginationNeeded(store, index);
      },
    );
  }
}
