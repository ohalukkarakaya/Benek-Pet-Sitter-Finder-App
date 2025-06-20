class MissionContentModel {
  String? videoUrl;
  String? timeCode;

  MissionContentModel({
    this.videoUrl,
    this.timeCode,
  });

  MissionContentModel.fromJson(Map<String, dynamic> json) {
    videoUrl = json['videoUrl'];
    timeCode = json['timeCode'] ?? json['missionTimePassword'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['videoUrl'] = videoUrl;
    data['timeCode'] = timeCode;
    return data;
  }
}