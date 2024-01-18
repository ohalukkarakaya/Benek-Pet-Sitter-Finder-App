import 'dart:developer';
import 'package:benek_kulube/common/constants/app_screens_enum.dart';
import 'package:benek_kulube/common/constants/tabs_enum.dart';
import 'package:benek_kulube/common/utils/shared_preferences_helper.dart';
import 'package:benek_kulube/data/models/kulube_login_qr_code_model.dart';
import 'package:benek_kulube/store/actions/app_actions.dart';
import 'package:benek_kulube/store/app_redux_store.dart';
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
    await prefs.remove('refreshToken');

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
    KulubeLoginQrCodeModel resetQrCodeData = KulubeLoginQrCodeModel( qrCode: "", clientId: "", expireTime: null );
    await store.dispatch(GetAdminLoginQrCodeAction(resetQrCodeData));
    await store.dispatch( GetUserInfoRequestAction(null) );
    await removeCredentials( store );
    await store.dispatch(const ChangeTabAction( AppTabsEnums.HOME_TAB ));
    await store.dispatch(const ChangeScreenAction( AppScreenEnums.LOGIN_SCREEN ));
  }
}