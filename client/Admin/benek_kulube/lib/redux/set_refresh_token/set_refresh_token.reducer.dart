import 'package:benek_kulube/redux/set_refresh_token/set_refresh_token.action.dart';

dynamic setRefreshTokenReducer(dynamic state, dynamic action) {
  if (action is SetRefreshTokenAction) {
    return action.refreshToken;
  } 

  return state;
}