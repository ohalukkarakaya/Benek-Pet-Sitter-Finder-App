import 'dart:developer';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/story_models/story_model.dart';

ThunkAction<AppState> selectStoryAction( StoryModel? story ) {
  return (Store<AppState> store) async {
    try {
      await store.dispatch(SelectStoryAction(story));
    } catch (e) {
      log('ERROR: selectStoryAction - $e');
    }
  };
}

class SelectStoryAction {
  final StoryModel? story;
  StoryModel? get selectedStory => story;
  SelectStoryAction(this.story);
}