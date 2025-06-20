import 'dart:developer';

import 'package:benek/common/utils/benek_string_helpers.dart';
import 'package:benek/data/services/api.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/story_models/story_model.dart';

ThunkAction<AppState> postStoryRequestAction( StoryModel story ) {
  return (Store<AppState> store) async {
    StoryApi api = StoryApi();

    if(
      story == null
      || story.contentUrl == null
      || story.desc == null
      || story.about == null
      || story.about!.pet == null
      || story.about!.pet!.id == null
    ){
      return;
    }

    try{
      Map<String, dynamic> data = await api.postStoryRequest( story.about!.pet!.id!, story.desc!, story.contentUrl! );

      if( data['storyId'] == null ){
        log('ERROR: postStoryRequestAction - storyId is null');
        return;
      }

      String storyId = data['storyId'];
      String contentUrl = data['contentUrl'];
      String storyExpireDateString = data['storyExpireDate'];

      DateTime storyExpireDate = BenekStringHelpers.formatDate( storyExpireDateString );

      story.storyId = storyId;
      story.contentUrl = contentUrl;
      story.createdAt = DateTime.now();
      story.expiresAt = storyExpireDate;

      await store.dispatch(PostStoryRequestAction(story));
    }catch( err ){
      log('ERROR: postStoryRequestAction - $err');
    }
  };
}

class PostStoryRequestAction {
  final StoryModel? _story;
  StoryModel? get story => _story;
  PostStoryRequestAction(this._story);
}