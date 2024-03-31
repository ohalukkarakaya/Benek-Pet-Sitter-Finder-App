import '../../store/actions/app_actions.dart';
import '../../data/models/story_models/story_model.dart';

List<StoryModel>? getStoriesByUserIdRequestReducer( List<StoryModel>? stories, dynamic action ){
  if( action is GetStoriesByUserIdRequestAction ){
    return action.stories;
  }

  return stories;
}