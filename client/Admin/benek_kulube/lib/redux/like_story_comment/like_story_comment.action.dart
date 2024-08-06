import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> likeStoryCommentOrReplyRequestAction( String storyId, String commentId, String? replyId ){
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if( storyId == null || commentId == null ){
      return;
    }

    try {

      bool? didRequestDone = await api.likeStoryCommentOrReplyRequest( storyId, commentId, replyId );
      await store.dispatch(LikeStoryCommentOrReplyRequestAction(didRequestDone, storyId, commentId, replyId));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
    }
  };
}

class LikeStoryCommentOrReplyRequestAction {
  final bool? _didRequestDone;
  final String? _storyId;
  final String? _commentId;
  final String? _replyId;

  bool? get didRequestDone => _didRequestDone;
  String? get storyId => _storyId;
  String? get commentId => _commentId;
  String? get replyId => _replyId;

  LikeStoryCommentOrReplyRequestAction(
      this._didRequestDone,
      this._storyId,
      this._commentId,
      this._replyId,
  );
}