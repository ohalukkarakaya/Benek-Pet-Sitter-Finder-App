import 'dart:developer';

import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:benek_kulube/data/services/api.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> postStoryCommentOrReplyRequestAction( String storyId, String desc, String? commentId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    bool isReply = commentId != null;

    CommentModel comment = CommentModel(
      isReply: isReply,
      user: store.state.userInfo!,
      comment: !isReply ? desc : null,
      reply: isReply ? desc : null,
      createdAt: DateTime.now()
    );

    try{
      String? registerId = await api.postCommentOrReply(
          storyId,
          desc,
          commentId
      );

      if( registerId == null ){
        log('ERROR: postStoryCommentOrReplyRequestAction - registerId is null');
        return;
      }

      comment.id = registerId;
      Map<String, dynamic> data = {
        'storyId': storyId,
        'comment': comment
      };

      await store.dispatch(PostStoryCommentOrReplyRequestAction(data));
    }catch( err ){
      log('ERROR: postStoryRequestAction - $err');
    }
  };
}

class PostStoryCommentOrReplyRequestAction {
  final Map<String, dynamic>? _data;
  Map<String, dynamic>? get data => _data;
  PostStoryCommentOrReplyRequestAction(this._data);
}