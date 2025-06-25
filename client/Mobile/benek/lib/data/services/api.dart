library benek.api;

import 'dart:convert';
import 'dart:developer';

import 'package:benek/data/models/chat_models/punishment_model.dart';
import 'package:benek/data/models/content_models/comment_model.dart';
import 'package:benek/data/models/user_profile_models/star_data_model.dart';
import 'package:benek/data/models/user_profile_models/user_list_model.dart';
import 'package:benek/store/app_state.dart';
import 'package:intl/intl.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:benek/common/constants/app_config.dart';
import 'package:benek/common/utils/state_utils/auth_utils/auth_utils.dart';
import 'package:benek/data/services/api_exception.dart';
import 'package:benek/store/app_redux_store.dart';
import 'package:http/http.dart';
import 'package:http/http.dart' as http;
// ignore: depend_on_referenced_packages
import 'package:http_parser/http_parser.dart';

import 'package:benek/data/models/user_profile_models/user_info_model.dart';

import '../../common/constants/app_screens_enum.dart';
import '../../redux/change_app_screen/change_app_screen.action.dart';
import '../models/care_give_models/report_state_model.dart';
import '../models/chat_models/chat_model.dart';
import '../models/chat_models/chat_state_model.dart';
import '../models/chat_models/message_model.dart';
import '../models/log_models/log_model.dart';
import '../models/payment_data_models/payment_data_model.dart';
import '../models/pet_models/pet_image_model.dart';
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
part 'user_search_api/user_search_api.dart';
part 'get_recomended_users_api/get_recomended_users_api.dart';
part 'story_api/story_api.dart';
part 'pet_api/pet_api.dart';
part 'pet_api/get_recommended_pets_api.dart';
part 'pet_api/pet_search_api.dart';
part 'get_user_info_apies/get_light_weight_user_info_by_user_id_list.dart';
part 'chat_moderating_apies/moderate_users_chat_as_admin/moderate_users_chat_as_admin_api.dart';
part 'chat_moderating_apies/moderate_users_messages_as_admin/moderate_users_messages_as_admin_api.dart';
part 'get_log_apies/get_logs_by_user_id_api.dart';
part 'punishment_apies/users_punishment_api.dart';
part 'user_info_api/user_get_private_info_api.dart';
part 'user_info_api/user_set_auth_role_api.dart';
part 'geocoding_api.dart';
part 'user_star_apies/get_selected_user_star_data_api.dart';
part 'care_give_apies/report_api.dart';
part 'payment_data_apies/payment_data_api.dart';

ApiClient defaultApiClient = ApiClient();
