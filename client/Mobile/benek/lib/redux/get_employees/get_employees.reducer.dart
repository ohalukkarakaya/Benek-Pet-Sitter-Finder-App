import 'package:benek/store/actions/app_actions.dart';

import '../../data/models/user_profile_models/user_info_model.dart';
import '../../data/models/user_profile_models/user_list_model.dart';

UserList? getEmployeesRequestReducer( UserList? employees, dynamic action ){
  if( action is GetEmployeesRequestAction ){
    return action.dataList;
  }
  return null;
}