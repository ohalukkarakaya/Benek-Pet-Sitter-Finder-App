import 'dart:developer';

import 'package:benek/data/models/content_models/comment_model.dart';
import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getStoryCommentRepliesRequestAction( String storyId, String commentId, String? lastReplyId ){
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();
    try {
      bool isPagination = lastReplyId != null && lastReplyId != 'null';

      String lastItemId = isPagination ? lastReplyId : 'null';
      int limit = 15;

      Map<String, dynamic>? _data = await api.getStoryCommentReplies( storyId, commentId, limit, lastItemId );

      await store.dispatch(GetStoryCommentRepliesRequestAction(
        isPagination,
        storyId,
        commentId,
        _data?['totalReplyCount'],
        _data?['replyCount'],
        _data?['list']
      ));

    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
    }
  };
}

ThunkAction<AppState> resetStoryCommentRepliesAction( String storyId, String commentId ){
  return (Store<AppState> store) async {
    await store.dispatch(ResetStoryCommentRepliesAction( storyId, commentId ));
  };

}

class ResetStoryCommentRepliesAction {
  final String? _storyId;
  final String? _commentId;

  String? get storyId => _storyId;
  String? get commentId => _commentId;

  ResetStoryCommentRepliesAction(
    this._storyId,
    this._commentId
  );
}

class GetStoryCommentRepliesRequestAction {
  final bool? _isPagination;
  final String? _storyId;
  final String? _commentId;
  final int? _totalReplyCount;
  final int? _replyCount;
  final List<CommentModel>? _replies;

  bool? get isPagination => _isPagination;
  String? get storyId => _storyId;
  String? get commentId => _commentId;
  int? get totalReplyCount => _totalReplyCount;
  int? get replyCount => _replyCount;
  List<CommentModel>? get replies => _replies;

  GetStoryCommentRepliesRequestAction(
      this._isPagination,
      this._storyId,
      this._commentId,
      this._totalReplyCount,
      this._replyCount,
      this._replies
  );
}