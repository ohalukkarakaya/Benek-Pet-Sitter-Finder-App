import 'dart:developer';

import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:benek_kulube/data/services/api.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> putEditStoryCommentOrReplyRequestAction( String newDesc, String storyId, String commentId, String? replyId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    try{
      String? newDescToRegister = await api.putEditCommentOrReply( newDesc, storyId, commentId, replyId );

      if( newDescToRegister == null ){
        log('ERROR: postStoryCommentOrReplyRequestAction - newDescToRegister is null');
        return;
      }

      await store.dispatch(PutEditStoryCommentOrReplyRequestAction(newDescToRegister, storyId, commentId, replyId));
    }catch( err ){
      log('ERROR: postStoryRequestAction - $err');
    }
  };
}

class PutEditStoryCommentOrReplyRequestAction {
  final String? _newDesc;
  final String? _storyId;
  final String? _commentId;
  final String? _replyId;

  String? get newDesc => _newDesc;
  String? get storyId => _storyId;
  String? get commentId => _commentId;
  String? get replyId => _replyId;

  PutEditStoryCommentOrReplyRequestAction(
      this._newDesc,
      this._storyId,
      this._commentId,
      this._replyId,
  );
}