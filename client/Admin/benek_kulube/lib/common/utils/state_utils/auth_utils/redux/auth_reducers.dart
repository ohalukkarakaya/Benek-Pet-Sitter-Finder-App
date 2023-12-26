import 'auth_actions.dart';

dynamic authUtilsReducer(dynamic state, dynamic action) {
  if (action is SetRefreshTokenAction) {
    return state.copyWith(userRefreshToken: action.refreshToken);
  } else if (action is SetAccessTokenAction) {
    return state.copyWith(userAccessToken: action.accessToken);
  } else if (action is SetUserRoleAction) {
    return state.copyWith(userRoleId: action.userRole);
  }

  return state;
}