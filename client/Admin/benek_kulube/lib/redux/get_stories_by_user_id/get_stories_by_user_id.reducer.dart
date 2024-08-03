import '../../data/models/user_profile_models/user_info_model.dart';
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
    int index = stories!.indexWhere((element) => element.storyId == action.data?['storyId']);
    stories[index].likeStory();

    if(stories[index].didUserLiked!){
      stories[index].firstFiveLikedUser = stories[index].firstFiveLikedUser ?? <UserInfo>[];
      stories[index].firstFiveLikedUser?.add(action.data?['user']);
    }else{
      stories[index].firstFiveLikedUser = stories[index].firstFiveLikedUser?.where(
          (user) =>
              user.userId != action.data?['user'].userId
      ).toList();
    }

    return stories;
  }else if( action is PostStoryRequestAction ){
    stories ??= <StoryModel>[];

    stories.add(action.story!);

    return stories;
  }else if( action is DeleteStoryByStoryIdRequestAction ){
    stories?.removeWhere((element) => element.storyId == action.storyId);

    return stories;
  }

  return stories;
}