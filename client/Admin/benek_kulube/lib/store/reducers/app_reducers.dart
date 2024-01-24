import '../app_state.dart';

import '../../presentation/features/counter/redux/counter_reducers.dart' as counter;

import '../../redux/change_app_screen/change_app_screen.reducer.dart' as change_app_screen;
import '../../redux/set_refresh_token/set_refresh_token.reducer.dart' as set_refresh_token;
import '../../redux/get_access_token_and_role_id/set_access_token.reducer.dart' as set_access_token;
import '../../redux/get_access_token_and_role_id/set_role_id.reducer.dart' as set_role_id;
import '../../redux/change_screen_tab/change_screen_tab.reducer.dart' as change_screen_tab;
import '../../redux/is_loading_state/is_loading_state.reducer.dart' as is_loading_state;
import '../../redux/get_user_info/get_user_info_request.reducer.dart' as get_user_info_request;
import '../../redux/admin_login_qr_code/admin_login_qr_code.reducer.dart' as get_admin_login_qr_code;
import '../../redux/set_current_location/set_current_location.reducer.dart' as set_current_location;
import '../../redux/user_search/user_search_request.reducer.dart' as user_search;
import '../../redux/get_recomended_users/get_recomended_users.reducer.dart' as get_recomended_users;

AppState appReducer(AppState state, dynamic action) {
  return AppState(
    counter: counter.counterReducer(state.counter, action),

    activeTab: change_screen_tab.changeTabReducer(state.activeTab, action),
    activeScreen: change_app_screen.changeAppScreenReducer(state.activeScreen, action),
    loginQrCodeData: get_admin_login_qr_code.setLoginCodeReducer(state.loginQrCodeData, action),
    userRefreshToken: set_refresh_token.setRefreshTokenReducer(state.userRefreshToken, action),
    userAccessToken:  set_access_token.setAccessTokenReducer(state.userAccessToken, action),
    userRoleId: set_role_id.setRoleIdReducer(state.userRoleId, action),
    userInfo: get_user_info_request.getUserInfoRequestReducer(state.userInfo, action),
    isLoading: is_loading_state.isLoadingStateReducer(state.isLoading, action),
    currentLocation: set_current_location.setCurrentLocationReducer(state.currentLocation, action),
    recomendedUsersList: get_recomended_users.userSearchRequestReducer(state.recomendedUsersList, action),
    userSearchResultList: user_search.userSearchRequestReducer(state.userSearchResultList, action),
  );
}