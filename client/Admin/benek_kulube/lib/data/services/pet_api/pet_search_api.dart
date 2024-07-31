part of benek.api;

class PetSearchApi {

  final ApiClient apiClient;

  PetSearchApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> getPetSearchRequest(String? lastItemId, String searchValue ) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      const int limit = 20;
      String lastItemIdString = lastItemId ?? 'null';

      String path = '/api/pet/getPetsBySearchValue/$searchValue/$lastItemIdString/$limit';

      Object? postBody = null;

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
        PetListModel deserializedResult = apiClient.deserialize( response.body, 'PetListModel' );

        return deserializedResult;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getPetSearchRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }
}