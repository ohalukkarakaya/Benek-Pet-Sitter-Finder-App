import '../../presentation/features/counter/redux/reducers.dart' as counter;
import '../../common/utils/auth_utils/redux/reducers.dart' as auth_utils;
import '../store.dart';

AppState appReducer(AppState state, dynamic action) {
  return AppState(
    counter: counter.counterReducer(state.counter, action),

    userRefreshToken: auth_utils.authUtilsReducer(state, action),
    userAccessToken:  auth_utils.authUtilsReducer(state, action),
    userRoleId: auth_utils.authUtilsReducer(state, action),
  );
}