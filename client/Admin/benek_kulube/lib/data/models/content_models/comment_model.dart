import '../../../presentation/features/date_helpers/date_time_helpers.dart';

class CommentModel {
  String? id;
  String? userId;
  String? comment;
  DateTime? createdAt;
  List<String>? likes;

  CommentModel({this.id, this.userId, this.comment, this.createdAt, this.likes});

  CommentModel.fromJson(Map<String, dynamic> json) {
    id = json['_id'];
    userId = json['userId'];
    comment = json['comment'];
    createdAt = DateTimeHelpers.getDateTime(json['createdAt']);
    likes = json['likes'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = id;
    data['userId'] = userId;
    data['comment'] = comment;
    data['createdAt'] = createdAt.toString();
    data['likes'] = likes;
    return data;
  }
}