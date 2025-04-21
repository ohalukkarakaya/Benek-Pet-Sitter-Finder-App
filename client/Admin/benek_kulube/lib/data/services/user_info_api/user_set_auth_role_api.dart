part of benek.api;

class UserSetAuthRoleApi {

  final ApiClient apiClient;

  UserSetAuthRoleApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Set User Authorization Role
  Future<dynamic> putSetUserAuthRoleRequest(String userId, String roleId) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/admin/giveUserAuthorizationRole/$userId/$roleId';

      Object? postBody;

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode  != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
        return false;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: putSetUserAuthRoleRequest - $err');
    }
  }

  Future<UserList?> getEmployeesRequest(String? lasItemId) async {
    try{
      await AuthUtils.getAccessToken();

      String limit = '15';
      if( lasItemId == null || lasItemId.isEmpty ){
        lasItemId = 'null';
      }

      String path = '/api/admin/getEmployees/$lasItemId/$limit';
      Object? postBody;
      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];
      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";
      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (response.statusCode == 404) {
        return null;
      } else if (response.body != null) {
        return await apiClient.deserialize(response.body, 'UserSearchResult') as UserList;
      } else {
        log('ERROR: getEmployeesRequest - response is null');
      }
    }catch( err ){
      log('ERROR: getEmployeesRequest - $err');
    }
    return null;
  }
}