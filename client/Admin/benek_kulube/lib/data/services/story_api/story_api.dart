part of benek.api;

class StoryApi {

  final ApiClient apiClient;

  StoryApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<List<StoryModel>?> getStoriesByUserIdRequest( String userId ) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/getStoryByUserId/$userId';

      Object? postBody;

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
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if(response.statusCode == 404){
        return apiClient.deserialize( '{"stories": []}', 'List<StoryModel>' ) as List<StoryModel>;
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'List<StoryModel>' ) as List<StoryModel>;
      }else{
        await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getStoriesByUserIdRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
    return null;
  }

  Future<Map<String, dynamic>?> getCommentsByStoryId(String storyId, String? lastElementId, int? limit) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try {
      await AuthUtils.getAccessToken();

      String lastElement = lastElementId ?? 'null';
      int limitCount = limit ?? 15;

      String path = '/api/user/interractions/story/comments/$storyId/$lastElement/$limitCount';

      Object? postBody;

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
      } else if (response.statusCode != 404 && response.body != null) {
        Map<String, dynamic> data =  apiClient.deserialize(response.body, 'List<CommentModel>') as Map<String, dynamic>;
        data['storyId'] = storyId;
        return data;
      }else if(response.statusCode == 404) {
        return {'totalCommentCount': 0, 'list': <CommentModel>[], 'storyId': storyId};
      }
    } catch (err) {
      log('ERROR: getCommentsByStoryId - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
    return null;
  }

  Future<bool> likeStoryRequest( String storyId ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/$storyId';

      Object? postBody;

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

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if(response.statusCode == 404){
        return false;
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: likeStoryRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
    return false;
  }
}