import 'get_access_token_and_role_id.action.dart';

int setRoleIdReducer( int roleId, dynamic action ){
  if( action is SetRoleIdAction ){
    return action.userRoleId;
  }

  return roleId;
}