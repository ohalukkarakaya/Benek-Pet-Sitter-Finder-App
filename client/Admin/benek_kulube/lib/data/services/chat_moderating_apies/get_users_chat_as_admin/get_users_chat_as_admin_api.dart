part of benek.api;

class GetUsersChatAsAdmin {

  final ApiClient apiClient;

  GetUsersChatAsAdmin([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> getUsersChatAsAdminRequest(String? userId, String? lastItemId) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      const int limit = 15;
      String lastItemIdString = lastItemId ?? 'null';

      String path = '/api/admin/getUsersChat/$userId/$limit/$lastItemIdString';

      Object? postBody = {};

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'ChatStateModel' ) as ChatStateModel;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getUsersChatAsAdminRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }
}