import 'auth_actions.dart';

dynamic setRefreshTokenReducer(dynamic state, dynamic action) {
  if (action is SetRefreshTokenAction) {
    return action.refreshToken;
  } 

  return state;
}

dynamic setAccessTokenReducer(dynamic state, dynamic action) {
  if (action is SetAccessTokenAction) {
    return action.accessToken;
  }

  return state;
}

dynamic setRoleReducer(dynamic state, dynamic action) {
  if (action is SetUserRoleAction) {
    return action.userRole;
  }

  return state;
}