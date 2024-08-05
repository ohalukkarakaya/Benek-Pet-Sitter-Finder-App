import 'dart:collection';
import 'dart:developer';
import 'package:flutter/material.dart';
import 'package:benek_kulube/common/constants/app_colors.dart';

// Import necessary files for DateTimeHelpers and API services
import '../../../presentation/features/date_helpers/date_time_helpers.dart';
import '../../services/api.dart';
import '../user_profile_models/user_info_model.dart';

class CommentModel {
  String? id;
  bool? isLastItem;
  bool? didUserLiked;
  UserInfo? user;
  String? comment;
  String? reply;
  List<CommentModel>? replies;
  DateTime? createdAt;
  List<UserInfo>? firstFiveLikedUser;
  List<String>? likes;
  int? likeCount;
  int? replyCount;
  List<UserInfo>? lastThreeRepliedUsers;

  CommentModel({
    this.id,
    this.isLastItem = false,
    this.didUserLiked = false,
    this.user,
    this.comment,
    this.reply,
    this.replies,
    this.createdAt,
    this.firstFiveLikedUser,
    this.likes,
    this.likeCount = 0,
    this.replyCount = 0,
    this.lastThreeRepliedUsers,
  });

  CommentModel.fromJson(Map<String, dynamic> json) {
    id = json['_id'];
    isLastItem = false;
    didUserLiked = json['didUserLiked'] ?? false;
    comment = json['comment'];
    reply = json['reply'];
    if (json['replies'] != null) {
      replies = <CommentModel>[];
      json['replies'].forEach((v) {
        replies!.add(CommentModel.fromJson(v));
      });
      sortReplies();
    }
    if (json['lastReply'] != null && json['lastReply'] is Map && (json['lastReply'] as Map).isNotEmpty) {
      replies = replies ?? <CommentModel>[];
      replies!.add(CommentModel.fromJson(json['lastReply']));
    }
    createdAt = DateTimeHelpers.getDateTime(json['createdAt']);
    if (json['firstFiveLikedUser'] != null) {
      firstFiveLikedUser = <UserInfo>[];
      json['firstFiveLikedUser'].forEach((v) {
        firstFiveLikedUser!.add(UserInfo.fromJson(v));
      });
    }
    likes = json['likes'] != null && json['likes'].isNotEmpty ? json['likes'].cast<String>() : [];
    likeCount = json['likes'] != null && json['likes'].isNotEmpty
        ? likes?.length
        : json['likeCount'] != null
          ? int.parse(json['likeCount'].toString())
          : 0;
    replyCount = json['replyCount'] != null ? int.parse(json['replyCount'].toString()) : 0;

    if (json['user'] != null) {
      user = UserInfo.fromJson(json['user']);
    } else if (json['userId'] != null) {
      _loadUser(json['userId']);
    }

    if (json['lastThreeRepliedUsers'] != null && json['lastThreeRepliedUsers'].isNotEmpty) {
      lastThreeRepliedUsers = <UserInfo>[];
      json['lastThreeRepliedUsers'].forEach((v) {
        lastThreeRepliedUsers!.add(UserInfo.fromJson(v));
      });
    }
  }

  Future<void> _loadUser(String userId) async {
    UserInfo? loadedUser = await initUser(userId);
    if (loadedUser != null) {
      user = loadedUser;
    }else{
      log('CommentModel - User not found: $userId');
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = id;
    data['comment'] = comment;
    data['reply'] = reply;
    if (replies != null) {
      data['replies'] = replies!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = createdAt.toString();
    if (firstFiveLikedUser != null) {
      data['firstFiveLikedUser'] = firstFiveLikedUser!.map((v) => v.toJson()).toList();
    }
    data['likes'] = likes;
    data['likeCount'] = likeCount;
    data['replyCount'] = replyCount;
    return data;
  }

  static Future<UserInfo?> initUser(String userId) async {
    LightWeightUserInfoByUserIdListApi lightWeightUserInfoApi = LightWeightUserInfoByUserIdListApi();
    List<UserInfo?> userInfoList = await lightWeightUserInfoApi.getLightWeightUserInfoByUserIdListRequest([userId]);
    UserInfo? userInfo = userInfoList[0];
    if (userInfo != null && userInfo.userId != null) {
      return userInfo;
    }
    return null;
  }

  void sortReplies() {
    replies?.sort((a, b) => b.createdAt!.compareTo(a.createdAt!));
  }

  void addReply(CommentModel reply) {
    replies = replies ?? <CommentModel>[];
    sortReplies();
    replies!.insert(0, reply);

    lastThreeRepliedUsers = lastThreeRepliedUsers ?? <UserInfo>[];

    List<String?>? userIdList = lastThreeRepliedUsers?.map((e) => e.userId).toList();

    if(
      userIdList == null
      || (userIdList != null && userIdList.isEmpty)
      || (userIdList != null && !userIdList.contains(reply.user!.userId))
    ){
      lastThreeRepliedUsers?.insert(0, reply.user!);
    }

    replyCount = replyCount! + 1;
  }

  void addReplies(List<CommentModel> replyList) {
    replies = replies ?? <CommentModel>[];
    replies = replyList + replies!;

    final uniqueReplies = LinkedHashMap<String, CommentModel>();

    for( var reply in replies! ){
      uniqueReplies[reply.id!] = reply;
    }

    for (var entry in uniqueReplies.entries) {
      if (entry.value.isLastItem ?? false) {
        entry.value.setAsLastItem(false);
        break;
      }
    }

    if(uniqueReplies.isNotEmpty){
      uniqueReplies.entries.first.value.setAsLastItem(true);
    }

    replies = uniqueReplies.values.toList();

    sortReplies();
  }

  void insertReplies(List<CommentModel> comingReplies) {
    if( comingReplies.isNotEmpty ){
      comingReplies[comingReplies.length - 1].setAsLastItem(true);
    }
    replies = comingReplies;
  }

  void setReplyCount(int replyCount) {
    this.replyCount = replyCount;
  }

  void setLikeCount(int likeCount) {
    this.likeCount = likeCount;
  }

  void addLike(String userId) {
    likes = likes ?? <String>[];
    likes!.add(userId);
    likeCount = likeCount! + 1;
  }

  void setAsLastItem( bool isLastItemResponse ){
    isLastItem = isLastItemResponse;
  }

  void editCommentOrReply( bool isReply, String newDesc ){
    if( isReply ){
      reply = newDesc;
    }else{
      comment = newDesc;
    }
  }

  void likeCommentOrReply( String? replyId ) {
    bool isReply = replyId != null;
    didUserLiked = isReply
        ? replies!.firstWhere((element) => element.id == replyId).didUserLiked ?? false
        : didUserLiked ?? false;
    if( isReply ) {
      replies!.firstWhere(
          (element) =>
              element.id == replyId
      ).likeCommentOrReply( null );
    }else{
      didUserLiked = !didUserLiked!;
      likeCount = didUserLiked!
          ? likeCount! + 1
          : likeCount! - 1;
    }
  }
}
