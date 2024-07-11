import 'dart:developer';
import 'package:benek_kulube/data/services/api_exception.dart';
import 'package:redux/redux.dart';

import 'package:benek_kulube/store/app_state.dart';
import 'package:redux_thunk/redux_thunk.dart';

import '../../data/models/user_profile_models/user_info_model.dart';

class SetRecentlySeenUserAction {
  final UserInfo? userInfo;

  SetRecentlySeenUserAction(this.userInfo);
}