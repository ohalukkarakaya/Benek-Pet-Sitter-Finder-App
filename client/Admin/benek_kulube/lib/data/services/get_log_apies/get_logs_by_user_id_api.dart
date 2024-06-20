part of benek.api;

class LogApi {
  final ApiClient apiClient;

  LogApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<dynamic> getLogsByUserId( String userId ) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      String path = '/log/byUserId/$userId';

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
        return apiClient.deserialize( response.body, 'List<LogModel>' ) as List<LogModel>;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getLogsByUserId - $err');
    }
  }
}