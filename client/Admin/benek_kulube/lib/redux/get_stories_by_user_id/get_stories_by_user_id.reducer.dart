import '../../store/actions/app_actions.dart';
import '../../data/models/story_models/story_model.dart';

List<StoryModel>? getStoriesByUserIdRequestReducer( List<StoryModel>? stories, dynamic action ){
  if( action is GetStoriesByUserIdRequestAction ){
    return action.stories;
  }else if( action is GetStoryCommentsByStoryIdRequestAction ){
   int index = stories!.indexWhere((element) => element.storyId == action.data?['storyId']);

   stories[index].setCommentCount( action.data?['totalCommentCount'] );
   if( action.data?['isPagination'] ){
     stories[index].addComments( action.data?['list'] );
   }else{
      stories[index].comments = action.data?['list'];
   }

   return stories;
  }else if( action is LikeStoryAction ) {
    int index = stories!.indexWhere((element) => element.storyId == action.storyId);
    stories[index].likeStory();

    return stories;
  }

  return stories;
}