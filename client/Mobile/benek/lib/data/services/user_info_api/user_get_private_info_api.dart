part of '../api.dart';

class UserPrivateInfoApi {

  final ApiClient apiClient;

  UserPrivateInfoApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> getUsersPrivateInfoRequest() async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/getPrivateUserInfo';

      Object? postBody;

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode  != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'PrivateInfoModel' ) as PrivateInfoModel;
      }
    }catch( err ){
      log('ERROR: getUserInfoRequest - $err');
    }
  }
}