part of benek.api;

class LightWeightUserInfoByUserIdListApi {

  final ApiClient apiClient;

  LightWeightUserInfoByUserIdListApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> getLightWeightUserInfoByUserIdListRequest(List<String> userIdList) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/getLightWeightUserInfo';

      Object? postBody = { 'userIdList': userIdList };

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      // queryParams.add(QueryParam("parentUserId", parentUserId.toString()));
      // queryParams.add(QueryParam("periodId", periodId.toString()));

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      if( contentType.startsWith("multipart/form-data") ){
        bool hasFields = false;
        MultipartRequest mp = MultipartRequest("", Uri.parse(""));
        // ignore: dead_code
        if ( hasFields ) postBody = mp;
      }

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'List<UserInfoModel>' ) as List<UserInfo>;
      }else{
        log('ERROR: getLightWeightUserInfoByUserIdListRequest - response body is null');
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getLightWeightUserInfoByUserIdListRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }
}