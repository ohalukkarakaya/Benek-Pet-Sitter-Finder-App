import 'package:benek/data/models/care_give_models/mission_content_model.dart';
import 'package:benek/data/models/care_give_models/mission_model.dart';

import '../user_profile_models/user_info_model.dart';

class ReportModel {
  String? reportId;
  String? desc;
  UserInfo? reporter;
  MissionModel? mission;
  bool? isExtra;
  MissionContentModel? content;
  bool? isMissionApproved;

  ReportModel(
      {
        this.reportId,
        this.desc,
        this.reporter,
        this.isExtra,
        this.content,
        this.isMissionApproved
      }
  );

  ReportModel.fromJson(Map<String, dynamic> json) {
    reportId = json['_id'] ?? json['reportId'];
    desc = json['reportDesc'] ?? json['desc'];
    reporter = json['reportOwner'] != null ? UserInfo.fromJson(json['reportOwner']) : null;
    mission = json['mission'] != null ? MissionModel.fromJson(json['mission']) : null;
    isExtra = json['isExtra'] ?? false;
    content = json['content'] != null ? MissionContentModel.fromJson(json['content']) : null;
    isMissionApproved = json['isMissionApproved'] ?? false;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['reportId'] = reportId;
    data['desc'] = desc;
    data['reporter'] = reporter?.toJson();
    data['mission'] = null;
    data['isExtra'] = isExtra;
    data['content'] = content?.toJson();
    data['isMissionApproved'] = isMissionApproved;
    return data;
  }
}