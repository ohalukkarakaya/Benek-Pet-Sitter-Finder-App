import 'dart:collection';

import 'package:benek_kulube/data/models/story_models/story_about_data_model.dart';
import '../../../presentation/features/date_helpers/date_time_helpers.dart';
import '../user_profile_models/user_info_model.dart';
import '../content_models/comment_model.dart';

class StoryModel {
  String? storyId;
  StoryAboutDataModel? about;
  String? desc;
  String? contentUrl;
  DateTime? createdAt;
  DateTime? expiresAt;
  UserInfo? user;
  int? likeCount;
  bool? didUserLiked;
  List<UserInfo>? firstFiveLikedUser;
  int? commentCount;
  List<CommentModel>? comments;

  StoryModel(
      {
        this.storyId,
        this.about,
        this.desc,
        this.contentUrl,
        this.createdAt,
        this.expiresAt,
        this.user,
        this.likeCount,
        this.didUserLiked,
        this.firstFiveLikedUser,
        this.commentCount,
        this.comments
      }
  );

  StoryModel.fromJson(Map<String, dynamic> json) {
    storyId = json['_id'];
    about = json['about'] != null ? StoryAboutDataModel.fromJson(json['about']) : null;
    desc = json['desc'];
    contentUrl = json['contentUrl'];
    createdAt = DateTimeHelpers.getDateTime(json['createdAt']);
    expiresAt = DateTimeHelpers.getDateTime(json['expiresAt']);
    user = json['user'] != null ? UserInfo.fromJson(json['user']) : null;
    likeCount = json['likeCount'];
    didUserLiked = json['didUserLiked'];
    firstFiveLikedUser = json['firstFiveLikedUser'] != null
        ? List<UserInfo>.from(json['firstFiveLikedUser'].map((x) => UserInfo.fromJson(x)))
        : null;
    comments = json['comments'] != null
        ? List<CommentModel>.from(json['comments'].map((x) => CommentModel.fromJson(x)))
        : null;
    commentCount = json['commentCount'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = storyId;
    if (about != null) {
      data['about'] = about!.toJson();
    }
    data['desc'] = desc;
    data['contentUrl'] = contentUrl;
    data['createdAt'] = createdAt.toString();
    data['expiresAt'] = expiresAt.toString();
    if (user != null) {
      data['user'] = user!.toJson();
    }
    data['likeCount'] = likeCount;
    if (comments != null && comments!.isNotEmpty) {
      data['lastComment'] = comments![0].toJson();
    }
    data['commentCount'] = commentCount;
    return data;
  }

  void sortComments() {
    comments?.sort((a, b) => b.createdAt!.compareTo(a.createdAt!));
  }

  void addComment(CommentModel comment) {
    comments ??= <CommentModel>[];
    sortComments();
    comments!.insert(0, comment);
  }

  void addComments(List<CommentModel> commentList) {
    comments ??= <CommentModel>[];
    comments = commentList + comments!;

    final uniqueComments = LinkedHashMap<String, CommentModel>();

    for (var comment in comments!) {
      uniqueComments[comment.id!] = comment;
    }

    for (var entry in uniqueComments.entries) {
      if (entry.value.isLastItem ?? false) {
        entry.value.setAsLastItem(false);
        break;
      }
    }

    if(uniqueComments.isNotEmpty){
     uniqueComments.entries.first.value.setAsLastItem(true);
    }

    comments = uniqueComments.values.toList();

    sortComments();
  }

  void insertComments(List<CommentModel> comingComments) {
    comingComments[comingComments.length - 1].setAsLastItem(true);
    comments ??= comingComments;
  }

  void addReplyToComment(String commentId, CommentModel reply) {
    comments ??= <CommentModel>[];
    for (var comment in comments!) {
      if (comment.id == commentId) {
        comment.addReply(reply);
        break;
      }
    }
  }

  void addRepliesToComment(String commentId, List<CommentModel> replyList) {
    comments ??= <CommentModel>[];
    for (var comment in comments!) {
      if (comment.id == commentId) {
        comment.addReplies(replyList);
        break;
      }
    }
  }

  void setCommentCount(int commentCount) {
    this.commentCount = commentCount;
  }

  void setLikeCount(int likeCount) {
    this.likeCount = likeCount;
  }

  void likeStory() {
    didUserLiked = didUserLiked ?? false;
    didUserLiked = !didUserLiked!;

    likeCount = didUserLiked! ? likeCount! + 1 : likeCount! - 1;
  }

  void resetComments(){
    comments = null;
  }

  void editCommentOrReply(String newDesc, String commentId, String? replyId) {
    bool isReply = replyId != null;

    CommentModel editingObject = isReply
        ? comments!.firstWhere((element) => element.id == commentId).replies!.firstWhere((element) => element.id == replyId)
        : comments!.firstWhere((element) => element.id == commentId);

    editingObject.editCommentOrReply(isReply, newDesc);
  }

  void deleteCommentOrReply( String commentId, String? replyId ){
    CommentModel? comment = comments?.firstWhere((element) => element.id == commentId );
    if( replyId != null ){
      String replyUserId = comment!.replies!.firstWhere((element) => element.id == replyId).user!.userId!;

      comment.replies!.removeWhere((element) => element.id == replyId);
      comment.replyCount = comment.replyCount! - 1;

      // TO DO: delete users photo from last three repliers list if there is no other comment user has
      List<String?>? userIdList = comment.lastThreeRepliedUsers?.map((e) => e.userId).toList();

      if(
          userIdList != null
          && userIdList.isNotEmpty
          && userIdList.contains( replyUserId )
          && comment.usersReplyCount! <= 1
      ){
        comment.lastThreeRepliedUsers = comment.lastThreeRepliedUsers?.where((element) => element.userId != replyUserId).toList();
      }

      comment.usersReplyCount = comment.usersReplyCount! - 1;
    }else{
      comments?.removeWhere((element) => element.id == commentId);
      commentCount = commentCount! - 1;
    }
  }
}