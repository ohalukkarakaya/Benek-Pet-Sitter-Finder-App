// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/story_models/story_model.dart';
import '../../data/models/user_profile_models/user_info_model.dart';

ThunkAction<AppState> getStoriesByUserIdRequestAction( String? userId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if( userId == null ){
      return;
    }

    try {
      List<StoryModel>? _stories = await api.getStoriesByUserIdRequest( userId );

      await store.dispatch(GetStoriesByUserIdRequestAction(_stories));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
    }
  };
}

ThunkAction<AppState> getStoriesByPetIdRequestAction( String? petId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if( petId == null ){
      return;
    }

    try {
      List<StoryModel>? _stories = await api.getStoriesByPetIdRequest( petId );

      await store.dispatch(GetStoriesByUserIdRequestAction(_stories));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByPetId - $e');
    }
  };
}

ThunkAction<AppState> setStoriesAction( List<StoryModel>? stories ) {
  return (Store<AppState> store) async {
    try {
      await store.dispatch(GetStoriesByUserIdRequestAction(stories));
    } on ApiException catch (e) {
      log('ERROR: getStoriesByUserId - $e');
      // await AuthUtils.killUserSessionAndRestartApp(store);
    }
  };
}

ThunkAction<AppState> likeStoryAction( String? storyId ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if( storyId == null ){
      return;
    }

    try {
      bool response = await api.likeStoryRequest( storyId );
      if( response ){
        UserInfo? user = store.state.userInfo;
        Map<String, dynamic> data = {'user': user, 'storyId': storyId};
        await store.dispatch(LikeStoryAction(data));
      }
    } on ApiException catch (e) {
      log('ERROR: likeStory - $e');
    }
  };
}

class GetStoriesByUserIdRequestAction {
  final List<StoryModel>? _stories;
  List<StoryModel>? get stories => _stories;
  GetStoriesByUserIdRequestAction(this._stories);
}

class LikeStoryAction {
  final Map<String, dynamic>? _data;
  Map<String, dynamic>? get data => _data;
  LikeStoryAction(this._data);
}