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
  bool? isReply;
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
    this.isReply = false,
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
    isReply = json['reply'] != null;
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
  }

  void addReplies(List<CommentModel> replyList) {
    replies = replies ?? <CommentModel>[];
    for (var reply in replyList) {
      replies!.add(reply);
    }
    sortReplies();
  }

  void insertReplies(List<CommentModel> replies) {
    this.replies = replies;
    sortReplies();
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
}
