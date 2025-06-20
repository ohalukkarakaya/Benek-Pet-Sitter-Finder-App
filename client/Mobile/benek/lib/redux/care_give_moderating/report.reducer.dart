import 'package:benek/data/models/care_give_models/report_state_model.dart';

import '../../store/actions/app_actions.dart';

ReportStateModel? reportReducer( ReportStateModel? reports, dynamic action ) {
  if( action is GetReportedMissionListAction ){
    return action.reports;
  }

  return reports;
}