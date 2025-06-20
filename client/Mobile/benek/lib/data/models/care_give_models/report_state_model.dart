import 'package:benek/data/models/care_give_models/report_model.dart';

class ReportStateModel {
  int? totalReportCount;
  int? selectedReportIndex;
  List<ReportModel>? reports;

  ReportStateModel({
    this.totalReportCount,
    this.selectedReportIndex = 0,
    this.reports,
  });

  ReportStateModel.fromJson(Map<String, dynamic> json) {
    totalReportCount = json['totalReportCount'] ?? json['reportedMissionCount'];
    selectedReportIndex = 0;
    if (json['reports'] != null) {
      reports = <ReportModel>[];
      json['reports'].forEach((v) {
        reports!.add(ReportModel.fromJson(v));
      });
    }else if(json['reportedMissionList'] != null) {
      reports = <ReportModel>[];
      json['reportedMissionList'].forEach((v) {
        reports!.add(ReportModel.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['selectedReportIndex'] = selectedReportIndex;
    data['totalReportCount'] = totalReportCount;
    if (reports != null) {
      data['reports'] = reports!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}