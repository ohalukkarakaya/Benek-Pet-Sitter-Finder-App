part of benek.api;

class RecomendedUsersApi {

  final ApiClient apiClient;
  
  RecomendedUsersApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> postRecomendedUsersRequest(String? lastItemId, double latitude, double longitude) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      const int limit = 5;
      String lastItemIdString = lastItemId ?? 'null';

      String path = '/api/user/getUsersAndEventsByLocation/$lastItemIdString/$limit';

      Object? postBody = {
        'lat': latitude,
        'lng': longitude
      };

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
      // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'UserSearchResult' ) as UserList;
      }else{
        await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: postRecomendedUsersRequest - $err');
      await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }
}