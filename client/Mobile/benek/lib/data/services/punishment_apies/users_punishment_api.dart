part of benek.api;

class  PunishmentApi {

  final ApiClient apiClient;

  PunishmentApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<dynamic> getUsersPunishmentData(String userId) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/admin/getPunishmentRecords/$userId';

      Object? postBody = {};

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";


      if( contentType.startsWith("multipart/form-data") ){
        bool hasFields = false;
        MultipartRequest mp = MultipartRequest("", Uri.parse(""));
        // ignore: dead_code
        if ( hasFields ) postBody = mp;
      }

      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){

        return apiClient.deserialize( response.body, 'List<PunishmentModel>' ) as List<PunishmentModel>;
      }else{
        log('ERROR: getUsersPunishmentData - response body is null');
      }

    }catch( err ){
      log('ERROR: getUsersPunishmentData - $err');
    }
  }

  Future<dynamic> getUsersPunishmentCountRequest(String userId) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/admin/punishmentCount/$userId';

      Object? postBody = {};

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

      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'PunishmentCount' ) as int;
      }else{
        log('ERROR: getUsersPunishmentCountRequest - response body is null');
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getLightWeightUserInfoByUserIdListRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }

  Future<dynamic> punishUserRequest(String userId, String punishmentDesc) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/admin/punishUser/$userId';

      Object? postBody = {
        "punishmentDesc": punishmentDesc
      };

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

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
        return json.decode(response.body)['didUserBanned'];
      }else{
        log('ERROR: punishUserRequest - response body is null');
        return false;
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      return false;
      log('ERROR: punishUserRequest - $err');
    }
  }
}