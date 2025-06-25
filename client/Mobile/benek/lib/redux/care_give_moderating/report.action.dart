// ignore_for_file: no_leading_underscores_for_local_identifiers

import 'dart:developer';

import 'package:benek/data/services/api.dart';
import 'package:benek/data/services/api_exception.dart';

// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';

import 'package:benek/store/app_state.dart';
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

ThunkAction<AppState> sendReportResponseAction( String reportId, bool adminresponse, String? responseDesc ) {
  return (Store<AppState> store) async {
    ReportApi api = ReportApi();

    try {
      bool result = await api.postGiveResponseToReportRequest(reportId, adminresponse, responseDesc);

      if (result) {
        // If the response is successful, fetch the updated report list
        ReportStateModel? _reports = store.state.reports;
        _reports?.totalReportCount = _reports.totalReportCount != null && _reports.totalReportCount! > 0
            ? _reports.totalReportCount! - 1
            : 0;

        final newReportsList = List<ReportModel>.from(_reports?.reports ?? []);
        newReportsList.removeWhere((report) => report.reportId == reportId);

        await store.dispatch(GetReportedMissionListAction(
            ReportStateModel(
              reports: newReportsList,
              totalReportCount: (_reports?.totalReportCount ?? 1) - 1,
              selectedReportIndex: (_reports?.selectedReportIndex ?? 0),
            )
        ));
      } else {
        log('ERROR: sendReportResponseAction - Failed to send report response');
      }
    } on ApiException catch (e) {
      log('ERROR: sendReportResponseAction - $e');
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