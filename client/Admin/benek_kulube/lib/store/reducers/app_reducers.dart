import '../app_state.dart';

import '../../presentation/features/counter/redux/counter_reducers.dart' as counter;

import '../../redux/change_app_screen/change_app_screen.reducer.dart' as change_app_screen;
import '../../redux/set_refresh_token/set_refresh_token.reducer.dart' as set_refresh_token;
import '../../redux/get_access_token_and_role_id/set_access_token.reducer.dart' as set_access_token;
import '../../redux/get_access_token_and_role_id/set_role_id.reducer.dart' as set_role_id;
import '../../redux/change_screen_tab/change_screen_tab.reducer.dart' as change_screen_tab;
import '../../redux/is_loading_state/is_loading_state.reducer.dart' as is_loading_state;
import '../../redux/user_info/user_info_requests.reducer.dart' as user_info_requests;
import '../../redux/admin_login_qr_code/admin_login_qr_code.reducer.dart' as get_admin_login_qr_code;
import '../../redux/set_current_location/set_current_location.reducer.dart' as set_current_location;
import '../../redux/user_search/user_search_request.reducer.dart' as user_search;
import '../../redux/get_recomended_users/get_recomended_users.reducer.dart' as get_recomended_users;
import '../../redux/selected_user/selected_user.reducer.dart' as selected_user;
import '../../redux/get_stories_by_user_id/get_stories_by_user_id.reducer.dart' as get_stories_by_user_id;
import '../../redux/set_device_language/set_device_language.reducer.dart' as set_device_language;
import '../../redux/select_story/select_story.reducer.dart' as selected_story;
import '../../redux/process_counter/process_counter.reducer.dart' as processCounter;
import '../../redux/pet_search/pet_search_request.reducer.dart' as pet_search;
import '../../redux/selected_pet/selected_pet.reducer.dart' as selected_pet;
import '../../redux/logs/get_logs_by_user_id/get_last_30_days_logs.reducer.dart' as get_last_30_days_logs;
import '../../redux/care_give_moderating/report.reducer.dart' as get_reports;

AppState appReducer(AppState state, dynamic action) {
  return AppState(
    counter: counter.counterReducer(state.counter, action),

    processCounter: processCounter.processCounterReducer(state.processCounter, action),

    deviceLanguage: set_device_language.setDeviceLanguageReducer(state.deviceLanguage, action),
    activeTab: change_screen_tab.changeTabReducer(state.activeTab, action),
    activeScreen: change_app_screen.changeAppScreenReducer(state.activeScreen, action),
    loginQrCodeData: get_admin_login_qr_code.setLoginCodeReducer(state.loginQrCodeData, action),
    userRefreshToken: set_refresh_token.setRefreshTokenReducer(state.userRefreshToken, action),
    userAccessToken:  set_access_token.setAccessTokenReducer(state.userAccessToken, action),
    userRoleId: set_role_id.setRoleIdReducer(state.userRoleId, action),
    userInfo: user_info_requests.getUserInfoRequestReducer(state.userInfo, action),
    isLoading: is_loading_state.isLoadingStateReducer(state.isLoading, action),
    currentLocation: set_current_location.setCurrentLocationReducer(state.currentLocation, action),
    recomendedUsersList: get_recomended_users.userSearchRequestReducer(state.recomendedUsersList, action),
    userSearchResultList: user_search.userSearchRequestReducer(state.userSearchResultList, action),
    petSearchResultList: pet_search.petSearchRequestReducer(state.petSearchResultList, action),
    selectedUserInfo: selected_user.setSelectedUserReducer(state.selectedUserInfo, action),
    selectedPet: selected_pet.SetSelectedPetReducer(state.selectedPet, action),
    storiesToDisplay: get_stories_by_user_id.getStoriesByUserIdRequestReducer(state.storiesToDisplay, action),
    selectedStory: selected_story.selectStoryReducer(state.selectedStory, action),
    logs: get_last_30_days_logs.getLast30DaysLogsReducer(state.logs, action),
    reports: get_reports.reportReducer(state.reports, action),
  );
}