import '../../store/actions/app_actions.dart';
import '../../data/models/story_models/story_model.dart';

StoryModel? selectStoryReducer( StoryModel? story, dynamic action ){
  if( action is SelectStoryAction ){
    return action.selectedStory;
  }

  return story;
}