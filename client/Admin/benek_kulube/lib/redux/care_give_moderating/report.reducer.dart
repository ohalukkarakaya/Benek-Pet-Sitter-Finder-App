import 'package:benek_kulube/data/models/care_give_models/report_state_model.dart';

import '../../data/models/content_models/comment_model.dart';
import '../../data/models/user_profile_models/user_info_model.dart';
import '../../store/actions/app_actions.dart';
import '../../data/models/story_models/story_model.dart';

ReportStateModel? reportReducer( ReportStateModel? reports, dynamic action ) {
  if( action is GetReportedMissionListAction ){
    return action.reports;
  }

  return reports;
}