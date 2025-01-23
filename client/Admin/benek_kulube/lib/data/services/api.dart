library benek.api;

import 'dart:convert';
import 'dart:developer';
import 'dart:io';

import 'package:benek_kulube/common/utils/benek_string_helpers.dart';
import 'package:benek_kulube/common/utils/benek_toast_helper.dart';
import 'package:benek_kulube/data/models/chat_models/punishment_model.dart';
import 'package:benek_kulube/data/models/content_models/comment_model.dart';
import 'package:benek_kulube/data/models/kulube_login_qr_code_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_list_model.dart';
import 'package:benek_kulube/store/app_state.dart';
import 'package:flutter/widgets.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek_kulube/common/constants/app_config.dart';
import 'package:benek_kulube/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek_kulube/data/services/api_exception.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
import 'package:http/http.dart';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

import '../models/chat_models/chat_state_model.dart';
import '../models/log_models/log_model.dart';
import '../models/pet_models/pet_list_model.dart';
import '../models/pet_models/pet_model.dart';
import '../models/story_models/story_model.dart';
import '../models/user_profile_models/private_info_model.dart';
import '../models/user_profile_models/user_location_model.dart';
import '../models/user_profile_models/user_profile_image_model.dart';

part 'api_client.dart';
part 'authentication.dart';
part 'user_info_api/user_info_api.dart';
part 'get_user_info_apies/get_user_info_by_user_id_api.dart';
part 'auth_api/auth_api.dart';
part 'admin_login_qr_code_api/admin_login_qr_code_api.dart';
part 'user_search_api/user_search_api.dart';
part 'get_recomended_users_api/get_recomended_users_api.dart';
part 'story_api/story_api.dart';
part 'pet_api/pet_api.dart';
part 'pet_api/get_recommended_pets_api.dart';
part 'pet_api/pet_search_api.dart';
part 'get_user_info_apies/get_light_weight_user_info_by_user_id_list.dart';
part 'chat_moderating_apies/get_users_chat_as_admin/get_users_chat_as_admin_api.dart';
part 'get_log_apies/get_logs_by_user_id_api.dart';
part 'punishment_apies/users_punishment_api.dart';
part 'user_info_api/user_get_private_info_api.dart';
part 'user_info_api/user_set_auth_role_api.dart';
part 'geocoding_api.dart';

ApiClient defaultApiClient = ApiClient();
