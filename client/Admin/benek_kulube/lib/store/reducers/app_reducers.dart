import '../app_state.dart';

import '../../presentation/features/counter/redux/counter_reducers.dart' as counter;
import '../../common/utils/state_utils/auth_utils/redux/auth_reducers.dart' as auth_reducers;
import '../../common/utils/state_utils/change_app_screen_utils/change_app_screen_reducers.dart' as change_app_screen;
import '../../common/utils/state_utils/is_loading_state_utils/is_loading_state_reducers.dart' as is_loading_state_reducers;

AppState appReducer(AppState state, dynamic action) {
  return AppState(
    counter: counter.counterReducer(state.counter, action),

    activeScreen: change_app_screen.changeAppScreenReducer(state, action),
    userRefreshToken: auth_reducers.authUtilsReducer(state.userRefreshToken, action),
    userAccessToken:  auth_reducers.authUtilsReducer(state.userAccessToken, action),
    userRoleId: auth_reducers.authUtilsReducer(state.userRoleId, action),
    isLoading: is_loading_state_reducers.isLoadingStateReducer(state.isLoading, action),
  );
}