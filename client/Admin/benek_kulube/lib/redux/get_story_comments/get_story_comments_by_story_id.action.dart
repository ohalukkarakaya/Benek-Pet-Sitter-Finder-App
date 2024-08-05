import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> getStoryCommentsByStoryIdRequestAction( String? storyId, String? lastCommentId ){
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if( storyId == null ){
      return;
    }

    try {
      bool isPagination = lastCommentId != null && lastCommentId != 'null';

      String lastItemId = isPagination ? lastCommentId : 'null';
      int limit = 15;

      Map<String, dynamic>? _data = await api.getCommentsByStoryId( storyId, lastItemId, limit );
      _data?['isPagination'] = isPagination;

      await store.dispatch(GetStoryCommentsByStoryIdRequestAction(_data));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> resetStoryCommentsAction( String? storyId ){
  return (Store<AppState> store) async {
    await store.dispatch(ResetStoryCommentsAction( storyId ));
  };
}

class ResetStoryCommentsAction {
  final String? _storyId;
  String? get storyId => _storyId;
  ResetStoryCommentsAction(this._storyId);
}

class GetStoryCommentsByStoryIdRequestAction {
  final Map<String, dynamic>? _data;
  Map<String, dynamic>? get data => _data;
  GetStoryCommentsByStoryIdRequestAction(this._data);
}