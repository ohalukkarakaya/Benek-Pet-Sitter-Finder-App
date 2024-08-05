import 'dart:developer';

import '../../data/models/content_models/comment_model.dart';
import '../../data/models/user_profile_models/user_info_model.dart';
import '../../store/actions/app_actions.dart';
import '../../data/models/story_models/story_model.dart';

List<StoryModel>? getStoriesByUserIdRequestReducer( List<StoryModel>? stories, dynamic action ){
  if( action is GetStoriesByUserIdRequestAction ){
    return action.stories;
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
  }else if( action is PostStoryCommentOrReplyRequestAction ){
    int index = stories!.indexWhere((element) => element.storyId == action.storyId);

    if( action.commentId == null ){
      stories[index].addComment( action.comment! );
    }else{
      stories[index].addReplyToComment( action.commentId!, action.comment! );
    }

    stories[index].commentCount = stories[index].commentCount! + 1;

    return stories;
  }else if( action is PutEditStoryCommentOrReplyRequestAction ){
    int index = stories!.indexWhere((element) => element.storyId == action.storyId);
    stories[index].editCommentOrReply( action.newDesc!, action.commentId!, action.replyId );

    return stories;

  }else if( action is GetStoryCommentsByStoryIdRequestAction ){
    int index = stories!.indexWhere((element) => element.storyId == action.data?['storyId']);

    stories[index].setCommentCount( action.data?['totalCommentCount'] );
    if( action.data?['isPagination'] ){
      stories[index].addComments( action.data?['list'] );
    }else{
      stories[index].insertComments( action.data?['list'] );
    }

    return stories;
  }else if( action is ResetStoryCommentsAction ){
    int index = stories!.indexWhere((element) => element.storyId == action.storyId);

    stories[index].comments = null;

    return stories;

  }else if( action is GetStoryCommentRepliesRequestAction ){
    int storyIndex = stories!.indexWhere((element) => element.storyId == action.storyId);
    int commentIndex = stories[storyIndex].comments!.indexWhere((element) => element.id == action.commentId);

    stories[storyIndex].comments?[commentIndex].setReplyCount( action.totalReplyCount! );
    if( action.isPagination! ) {
      stories[storyIndex].comments?[commentIndex].addReplies( action.replies ?? <CommentModel>[] );
    }else{
      stories[storyIndex].comments?[commentIndex].insertReplies( action.replies ?? <CommentModel>[] );
    }

    return stories;
  }else if( action is ResetStoryCommentRepliesAction ){
    int storyIndex = stories!.indexWhere((element) => element.storyId == action.storyId);
    int commentIndex = stories[storyIndex].comments!.indexWhere((element) => element.id == action.commentId);

    stories[storyIndex].comments?[commentIndex].replies = null;

    return stories;
  }else if( action is LikeStoryCommentOrReplyRequestAction ){
    int index = stories!.indexWhere((element) => element.storyId == action.storyId);

    stories[index].comments!
      .firstWhere((element) => element.id == action.commentId)
      .likeCommentOrReply( action.replyId );

    return stories;
  }else if( action is DeleteStoryCommentOrReplyRequestAction ){
    int index = stories!.indexWhere((element) => element.storyId == action.storyId);

    stories[index].deleteCommentOrReply(action.commentId!, action.replyId);

    return stories;
  }

  return stories;
}