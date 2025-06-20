import 'dart:developer';

import 'package:benek/data/models/content_models/comment_model.dart';
import 'package:benek/data/services/api.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> postStoryCommentOrReplyRequestAction( String storyId, String desc, String? commentId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    bool isReply = commentId != null;

    CommentModel comment = CommentModel(
      user: store.state.userInfo!,
      comment: !isReply ? desc : null,
      reply: isReply ? desc : null,
      createdAt: DateTime.now()
    );

    try{
      String? registerId = await api.postCommentOrReply( storyId, desc, commentId);

      if( registerId == null ){
        log('ERROR: postStoryCommentOrReplyRequestAction - registerId is null');
        return;
      }

      comment.id = registerId;

      await store.dispatch(PostStoryCommentOrReplyRequestAction( storyId, commentId, comment ));
    }catch( err ){
      log('ERROR: postStoryCommentOrReplyRequestAction - $err');
    }
  };
}

class PostStoryCommentOrReplyRequestAction {
  final String? _storyId;
  final String? _commentId;
  final CommentModel? _comment;

  String? get storyId => _storyId;
  String? get commentId => _commentId;
  CommentModel? get comment => _comment;

  PostStoryCommentOrReplyRequestAction(
    this._storyId,
    this._commentId,
    this._comment
  );
}