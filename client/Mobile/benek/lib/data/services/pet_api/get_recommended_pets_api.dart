part of '../api.dart';

class RecommendedPetsApi {

  final ApiClient apiClient;

  RecommendedPetsApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> getRecommendedPetsRequest() async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/pet/getRecommendedPets';

      Object? postBody;

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
        return apiClient.deserialize( response.body, 'List<PetModel>' ) as List<PetModel>;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getRecommendedPetsRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }
}