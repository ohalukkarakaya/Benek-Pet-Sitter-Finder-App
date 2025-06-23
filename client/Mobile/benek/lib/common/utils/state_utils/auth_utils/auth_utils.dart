import 'dart:developer';
import 'package:benek/common/constants/app_screens_enum.dart';
import 'package:benek/common/constants/tabs_enum.dart';
import 'package:benek/common/utils/shared_preferences_helper.dart';
import 'package:benek/store/actions/app_actions.dart';
import 'package:benek/store/app_redux_store.dart';
// ignore: depend_on_referenced_packages
import 'package:redux/redux.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../../store/app_state.dart';

class AuthUtils {

  // Set Refresh Token
  static Future<bool> setRefreshToken() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? refreshToken = prefs.getString(SharedPreferencesKeys.refreshToken);
    
    if (refreshToken != null) {
      await store.dispatch(SetRefreshTokenAction(refreshToken));
    } else {
      return false;
    }

    return true;
  }

  // Get Access Token
  static Future<void> getAccessToken() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try {
        if( store.state.userRefreshToken == '') {
          await killUserSessionAndRestartApp( store );
        }

        await store.dispatch(getAccessTokenAndRoleIdRequestAction());
      } catch (e) {
        log('ERROR: getAccessToken - $e');
        await killUserSessionAndRestartApp( store );
      }
  }

  static Future<void> setCredentials() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try {
      bool isRefreshTokenSet = await setRefreshToken();
      if( isRefreshTokenSet ){
        await getAccessToken();
        await store.dispatch(getUserInfoRequestAction());
        await store.dispatch(const ChangeScreenAction( AppScreenEnums.HOME_SCREEN ));
      }else{
         await killUserSessionAndRestartApp( store );
      }
    } catch (e) {
      log('ERROR: setCredentials - $e');
      await killUserSessionAndRestartApp( store );
    }
  }

  static Future<void> removeCredentials( Store<AppState> store ) async {
    // Remove Refresh Token
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('refresh_token');

    // Remove Access Token
    if( store.state.userAccessToken != '') {
      await store.dispatch(SetAccessTokenAction(''));
    }

    // Remove User Role
    if( store.state.userRoleId != 0 ) {
      await store.dispatch(SetRoleIdAction(0));
    }
  }

  static Future<void> killUserSessionAndRestartApp( Store<AppState> store ) async {
    await store.dispatch( GetUserInfoRequestAction(null) );
    await removeCredentials( store );
    await store.dispatch(const ChangeTabAction( AppTabsEnums.HOME_TAB ));
    await store.dispatch(const ChangeScreenAction( AppScreenEnums.LOGIN_SCREEN ));
  }
}