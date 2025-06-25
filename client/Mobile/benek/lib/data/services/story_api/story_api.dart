part of '../api.dart';

class StoryApi {

  final ApiClient apiClient;

  StoryApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<List<StoryModel>?> getStoriesByUserIdRequest( String userId ) async {
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
      }
    }catch( err ){
      log('ERROR: getStoriesByUserIdRequest - $err');
    }
    return null;
  }

  Future<List<StoryModel>?> getStoriesByPetIdRequest( String petId ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/getStoryByPetId/$petId';

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
      }else if(response.statusCode == 404){
        return apiClient.deserialize( '{"stories": []}', 'List<StoryModel>' ) as List<StoryModel>;
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'List<StoryModel>' ) as List<StoryModel>;
      }
    }catch( err ){
      log('ERROR: getStoriesByPetIdRequest - $err');
    }
    return null;
  }

  Future<Map<String, dynamic>> postStoryRequest(String abutId, String desc, String src ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story';

      Object? postBody;

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["multipart/form-data;"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      if( contentType.startsWith("multipart/form-data") ){
        bool hasFields = false;
        MultipartRequest mp = MultipartRequest("POST", Uri.parse(AppConfig.baseUrl + path));

        mp.fields.addAll({
          'aboutId': abutId,
          'aboutType': 'pet',
          'desc': desc
        });

        String mimeType = 'application/octet-stream';
        if (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.JPG') || src.endsWith('.JPEG')) {
          mimeType = 'image/jpeg';
        } else if (src.endsWith('.mp4') || src.endsWith('.MP4')) {
          mimeType = 'video/mp4';
        }

        mp.files.add(await http.MultipartFile.fromPath(
            'file',
            src,
            contentType: MediaType.parse(mimeType)
        ));
        hasFields = true;
        if ( hasFields ) postBody = mp;
      }

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        var decodedJson = json.decode(response.body);
        return {
          'storyId': decodedJson['storyId'],
          'contentUrl': decodedJson['contentUrl'],
          'storyExpireDate': decodedJson['storyExpireDate']
        };
      }
    }catch( err ){
      log('ERROR: postStoryRequest - $err');
    }
    return {};
  }

  Future<bool> deleteStoryRequest( String storyId ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story';

      Object? postBody = {
        'storyId': storyId
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

      var response = await apiClient.invokeAPI(path, 'DELETE', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if(response.statusCode == 404){
        return false;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: deleteStoryRequest - $err');
    }
    return false;
  }

  Future<bool> likeStoryRequest( String storyId  ) async {
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
      }else if(response.statusCode == 404){
        return false;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: likeStoryRequest - $err');
    }
    return false;
  }

  Future<String?> postCommentOrReply(String storyId, String desc, String? commentId) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/comments/$storyId';

      Map<String, dynamic> postBody = {
        'desc': desc
      };

      if( commentId != null ){
        postBody['commentId'] = commentId;
      }

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if(response.statusCode == 404){
        return null;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        var decodedJson = json.decode(response.body);
        return decodedJson['commentId'] ?? decodedJson['replyId'];
      }
    }catch( err ){
      log('ERROR: postCommentOrReply - $err');
    }

    return null;
  }

  Future<String?> putEditCommentOrReply(String newDesc, String storyId, String commentId, String? replyId) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/comments/edit/$storyId';

      Map<String, dynamic> postBody = {
        'desc': newDesc,
        'commentId': commentId
      };

      if( replyId != null ){
        postBody['replyId'] = replyId;
      }

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if(response.statusCode == 404){
        return null;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null && response.statusCode == 200 ){
        return newDesc;
      }

      return null;
    }catch( err ){
      log('ERROR: putEditCommentOrReply - $err');
    }
    return null;
  }

  Future<Map<String, dynamic>?> getCommentsByStoryId(String storyId, String? lastElementId, int? limit ) async {
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
      List<String> authNames = [];

      String contentType = "application/json";

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
    }
    return null;
  }

  Future<Map<String, dynamic>?> getStoryCommentReplies( String storyId, String commentId, int? limit, String? lastElementId ) async {
    try{
      await AuthUtils.getAccessToken();

      int limitCount = limit ?? 15;
      String lastElement = lastElementId ?? 'null';

      String path = '/api/user/interractions/story/comments/getReplies/$storyId/$commentId/$lastElement/$limitCount';

      Object? postBody;

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        throw ApiException(code: response.statusCode, message: response.body);
      }else if(response.statusCode == 404){
        return {'totalReplyCount': 0, 'list': <CommentModel>[]};
        // ignore: unnecessary_null_comparison
      }else if( response.body != null && response.statusCode == 200 ){
        return apiClient.deserialize( response.body, 'ReplyList' ) as Map<String, dynamic>;
      }
    }catch( err ){
      log('ERROR: getStoryCommentReplies - $err');
    }
    return null;
  }

  Future<bool?> likeStoryCommentOrReplyRequest( String storyId, String commentId, String? replyId ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/comments/likeCommentOrReply';

      Map<String, dynamic>? postBody = {
        'storyId': storyId,
        'commentId': commentId
      };

      if( replyId != null ){
        postBody['replyId'] = replyId;
      }

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if(response.statusCode == 404){
        return null;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: likeStoryCommentOrReplyRequest - $err');
    }
    return null;
  }

  Future<bool?> deleteStoryCommentOrReplyRequest( String storyId, String commentId, String? replyId ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/user/interractions/story/comments/$storyId';

      Map<String, dynamic>? postBody = {
        'commentId': commentId
      };

      if( replyId != null ){
        postBody['replyId'] = replyId;
      }

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'DELETE', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if(response.statusCode == 404){
        return null;
        // ignore: unnecessary_null_comparison
      }else if( response.body != null && response.statusCode == 200 ){
        return true;
      }
    }catch( err ){
      log('ERROR: deleteStoryCommentOrReply - $err');
    }
    return null;
  }
}