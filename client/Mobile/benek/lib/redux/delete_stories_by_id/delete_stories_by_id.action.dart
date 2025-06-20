import 'dart:developer';
import 'package:benek/data/services/api.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

ThunkAction<AppState> deleteStoryByStoryIdRequestAction( String? storyId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if (storyId == null) {
      return;
    }

    try {
      bool response = await api.deleteStoryRequest(storyId);
      if (response) {
        await store.dispatch(DeleteStoryByStoryIdRequestAction(storyId));
      }
    } catch (err) {
      log('ERROR: getStoriesByUserIdRequestAction - $err');
    }
  };
}

class DeleteStoryByStoryIdRequestAction {
  final String? _storyId;
  String? get storyId => _storyId;
  DeleteStoryByStoryIdRequestAction(this._storyId);
}