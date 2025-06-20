import '../content_models/comment_model.dart';

class PetImageModel {
  String? imgUrl;
  List<String>? likes;
  String? id;
  List<CommentModel>? comments;

  PetImageModel({this.imgUrl, this.likes, this.id, this.comments});

  PetImageModel.fromJson(Map<String, dynamic> json) {
    imgUrl = json['imgUrl'];
    likes = json['likes']?.cast<String>();
    id = json['_id'];
    if (json['comments'] != null) {
      comments = <CommentModel>[];
      json['comments'].forEach((v) {
        comments!.add(CommentModel.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['imgUrl'] = imgUrl;
    data['likes'] = likes;
    data['_id'] = id;
    if (comments != null) {
      data['comments'] = comments!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}