part of benek.api;

class ModerateUsersChatAsAdmin {

  final ApiClient apiClient;

  ModerateUsersChatAsAdmin([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get chat
  Future<dynamic> getUsersChatAsAdminRequest(String? userId, String? lastItemId) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      const int limit = 15;
      String lastItemIdString = lastItemId ?? 'null';

      bool isUsersOwnChat = userId == store.state.userInfo!.userId;

      String path = !isUsersOwnChat
          ? '/api/admin/getUsersChat/$userId/$limit/$lastItemIdString'
          : '/api/chat/get/$lastItemIdString/$limit';

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

  Future<dynamic> getSearchChatAsAdminRequest(String? userId, String? searchText) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      bool isUsersOwnChat = userId == store.state.userInfo!.userId;

      String path = !isUsersOwnChat
          ? '/api/admin/searchUsersChat/$userId/$searchText'
          : '/api/chat/search/$searchText';

      Object? postBody = {};

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'GET', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
        // ignore: unnecessary_null_comparison
      }else if( response.statusCode == 404 ){
        ChatStateModel chatStateModel = ChatStateModel(totalChatCount: 0, chats: []);
        return chatStateModel;
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'ChatStateModel' ) as ChatStateModel;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getSearchChatAsAdminRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }

  Future<dynamic> getUnreadMessagesFromChatId(String chatId, String userId) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/chat/unreadMessageCount/$chatId/$userId';

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
        return apiClient.deserialize( response.body, 'UnreadMessageCount' ) as int;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getUnreadMessagesFromChatId - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }

  Future<dynamic> seeMessages(String chatId, List<String> messageIds) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/chat/messages/see/$chatId';

      Object? postBody = { 'messagesIdsList': messageIds };

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
        return true;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: seeMessages - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }

  Future<dynamic> postCreateChatRequest(String desc, List<String> memberList) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/chat/create';

      memberList  = memberList.where((memberId) => memberId != store.state.userInfo!.userId).toList();

      Object? postBody = {
        'memberList': memberList,
        'chatDesc': desc
      };

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];
      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 ) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if( response.body != null ) {
        return jsonDecode(response.body)['chatId'];
      }
    }catch( errr ){
      log('ERROR: postCreateChatRequest - $errr');
    }
  }

  Future<dynamic> postAddMemberToChatRequest(String chatId, List<String> memberList) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/chat/addMember/$chatId';
      memberList  = memberList.where((memberId) => memberId != store.state.userInfo!.userId).toList();

      Object? postBody = { 'memberList': memberList };

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];
      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 ) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if( response.body != null ) {
        return jsonDecode(response.body)['chatId'];
      }

    }catch( errr ){
      log('ERROR: postAddMemberToChatRequest - $errr');
    }
  }

  Future<dynamic> deleteLeaveChatRequest( String chatId ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/chat/leave/$chatId';

      Object? postBody = {};

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];
      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'DELETE', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 ) {
        throw ApiException(code: response.statusCode, message: response.body);
      }else if( response.body != null ) {
        return jsonDecode(response.body)['chatId'];
      }
    }catch( errr ){
      log('ERROR: deleteLeaveChatRequest - $errr');
    }
  }
}