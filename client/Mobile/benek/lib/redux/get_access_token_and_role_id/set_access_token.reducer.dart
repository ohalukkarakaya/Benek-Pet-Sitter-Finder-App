import 'get_access_token_and_role_id.action.dart';

String setAccessTokenReducer( String accessToken, dynamic action ){
  if( action is SetAccessTokenAction ){
    return action.accessToken;
  }

  return accessToken;
}