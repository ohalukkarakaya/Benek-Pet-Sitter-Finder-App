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
  CommentModel? lastComment;
  int? commentCount;

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
        this.lastComment,
        this.commentCount
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
    lastComment = json['lastComment'] != null
        ? CommentModel.fromJson(json['lastComment'])
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
    if (lastComment != null) {
      data['lastComment'] = lastComment!.toJson();
    }
    data['commentCount'] = commentCount;
    return data;
  }
}