import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:redux/redux.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../app/router.dart';
import '../../../store/store.dart';
import 'redux/actions.dart';
import '../../../config/app_config.dart';

class AuthUtils {

  // Set Refresh Token
  static Future<void> setRefreshToken(Store<AppState> store, BuildContext context) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? refreshToken = prefs.getString('refreshToken');
    
    if (refreshToken != null) {
      await store.dispatch(SetRefreshTokenAction(refreshToken));
    } else {
      removeCredentials(store, context);
    }
  }

  // Get Access Token
  static Future<void> getAccessToken(Store<AppState> store, BuildContext context) async {
    try {
        if( store.state.userRefreshToken == null || store.state.userRefreshToken == '') {
          removeCredentials(store, context);
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
            removeCredentials(store, context);
          }
        }else{
          removeCredentials(store, context);
        }
      } catch (e) {
        print('ERROR: getAccessToken - $e');
        removeCredentials(store, context);
      }
  }

  static Future<void> setCredentials( Store<AppState> store, BuildContext context ) async {
    try {
      await setRefreshToken(store, context);
      await getAccessToken(store, context);
    } catch (e) {
      print('Hata oluştu: $e');
      removeCredentials(store, context);
    }
  }

  static Future<void> removeCredentials( Store<AppState> store, BuildContext context ) async {
    // Remove Refresh Token
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('refreshToken');

    // Remove Access Token
    if( store.state.userAccessToken != null || store.state.userAccessToken != '') {
      await store.dispatch(SetAccessTokenAction(''));
    }

    // Remove User Role
    if( store.state.userRoleId != null || store.state.userRoleId != 0 ) {
      await store.dispatch(SetUserRoleAction(0));
    }

    // Navigate to Login Page
    AppRouter.navigateToRoute('/login', context, true);
  }
}