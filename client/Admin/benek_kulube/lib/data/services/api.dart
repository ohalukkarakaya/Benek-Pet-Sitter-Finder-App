library benek.api;

import 'dart:convert';
import 'dart:developer';

import 'package:benek_kulube/data/models/kulube_login_qr_code_model.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:redux/redux.dart';
import 'package:benek_kulube/common/constants/app_config.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:http/http.dart';
import 'package:http/http.dart' as http;

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

part 'api_client.dart';
part 'authentication.dart';
part 'user_info_api/user_info_api.dart';
part 'auth_api/auth_api.dart';
part 'admin_login_qr_code_api/admin_login_qr_code_api.dart';

ApiClient defaultApiClient = ApiClient();
