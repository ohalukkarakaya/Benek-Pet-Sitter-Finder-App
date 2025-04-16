// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek_kulube/data/services/api.dart';
import 'package:benek_kulube/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/care_give_models/report_model.dart';
import '../../data/models/care_give_models/report_state_model.dart';

ThunkAction<AppState> getReportedMissionListAction() {
  return (Store<AppState> store) async {
    ReportApi api = ReportApi();

    try {
      ReportStateModel? _reports = await api.getReportedMissionListRequest();

      List<ReportModel> existingReports = store.state.reports?.reports ?? [];
      List<ReportModel> newReports = _reports?.reports ?? [];

      // Check if the new reports are already in the existing reports
      List<ReportModel> filteredReports = newReports.where((newReport) {
        return !existingReports.any((existingReport) => existingReport.reportId == newReport.reportId);
      }).toList();

      // Add the new reports to the existing reports
      existingReports.addAll(filteredReports);

      // Update reports list
      _reports?.reports = existingReports;
      _reports?.selectedReportIndex = store.state.reports?.selectedReportIndex;

      await store.dispatch(GetReportedMissionListAction(_reports));
    } on ApiException catch (e) {
      log('ERROR: getReportedMissionList - $e');
    }
  };
}

ThunkAction<AppState> resetReportsAction() {
  return (Store<AppState> store) async {
    try {
      await store.dispatch(GetReportedMissionListAction(null));
    } on ApiException catch (e) {
      log('ERROR: resetReports - $e');
    }
  };
}

ThunkAction<AppState> setSelectedReportIndex(int index){
  return (Store<AppState> store) async {
    try {
      ReportStateModel? _reports = store.state.reports;
      if( index < 0 || index >= _reports!.reports!.length){
        return;
      }

      _reports.selectedReportIndex = index;
      await store.dispatch(GetReportedMissionListAction(_reports));
    } on ApiException catch (e) {
      log('ERROR: setSelectedReportIndex - $e');
    }
  };

}

class GetReportedMissionListAction {
  final ReportStateModel? reports;

  GetReportedMissionListAction(this.reports);
}