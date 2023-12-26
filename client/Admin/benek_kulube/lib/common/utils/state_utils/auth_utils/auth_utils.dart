import 'dart:convert';
import 'dart:developer';
import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/utils/state_utils/change_app_screen_utils/change_app_screen_actions.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:redux/redux.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../store/app_state.dart';
import 'redux/auth_actions.dart';
import '../../../constants/app_config.dart';

class AuthUtils {

  // Set Refresh Token
  static Future<void> setRefreshToken(Store<AppState> store ) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? refreshToken = prefs.getString('refreshToken');
    
    if (refreshToken != null) {
      await store.dispatch(SetRefreshTokenAction(refreshToken));
    } else {
      await killUserSessionAndNavigate( store );
    }
  }

  // Get Access Token
  static Future<void> getAccessToken(Store<AppState> store ) async {
    try {
        if( store.state.userRefreshToken == '') {
          await killUserSessionAndNavigate( store );
        }

        final response = await http.post(
          Uri.parse(AppConfig.baseUrl + "/api/refreshToken"),
          body: jsonEncode({ 'refreshToken': store.state.userRefreshToken }),
          headers: {'Content-Type': 'application/json'},
        );

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);

          if (data['error'] == false) {
            String accessToken = data['accessToken'];
            int userRole = data['role'];

            await store.dispatch(SetAccessTokenAction(accessToken));
            await store.dispatch(SetUserRoleAction(userRole));
          }else{
            await killUserSessionAndNavigate( store );
          }
        }else{
          await killUserSessionAndNavigate( store );
        }
      } catch (e) {
        log('ERROR: getAccessToken - $e');
        await killUserSessionAndNavigate( store );
      }
  }

  static Future<void> setCredentials( Store<AppState> store, BuildContext context ) async {
    try {
      await setRefreshToken(store );
      await getAccessToken(store );
    } catch (e) {
      log('ERROR: getAccessToken - $e');
      await killUserSessionAndNavigate(store );
    }
  }

  static Future<void> removeCredentials( Store<AppState> store ) async {
    // Remove Refresh Token
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('refreshToken');

    // Remove Access Token
    if( store.state.userAccessToken != '') {
      await store.dispatch(SetAccessTokenAction(''));
    }

    // Remove User Role
    if( store.state.userRoleId != 0 ) {
      await store.dispatch(SetUserRoleAction(0));
    }
  }

  static Future<void> killUserSessionAndNavigate( Store<AppState> store ) async {
    await removeCredentials( store );
    await store.dispatch(const ChangeScreenAction( AppScreenEnums.LOGIN_SCREEN ));
  }
}