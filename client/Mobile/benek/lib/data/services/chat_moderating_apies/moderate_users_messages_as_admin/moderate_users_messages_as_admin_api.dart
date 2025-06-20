part of benek.api;

class ModerateUsersMessagesAsAdmin {

  final ApiClient apiClient;

  ModerateUsersMessagesAsAdmin([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<dynamic> getUsersMessagesAsAdminRequest(String userId, String chatId, String? lastItemId) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      const int limit = 15;
      String lastItemIdString = lastItemId ?? 'null';

      bool isUsersOwnChat = userId == store.state.userInfo!.userId;

      String path = !isUsersOwnChat
          ? '/api/admin//getUsersMessages/$userId/$chatId/$limit/$lastItemIdString'
          : '/api/chat/messages/get/$chatId/$lastItemId/$limit';

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
        return apiClient.deserialize( response.body, 'List<MessageModel>' ) as ChatModel;
      }else{
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getUsersMessagesAsAdminRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }

  Future<dynamic> postSendMessage( String chatId, String message ) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/chat/messages/send/$chatId/Text';
      Object? postBody;

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["multipart/form-data"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      if( contentType.startsWith("multipart/form-data") ){
        bool hasFields = false;
        MultipartRequest mp = MultipartRequest("POST", Uri.parse(AppConfig.baseUrl + path));

        mp.fields.addAll({
          'message': message
        });

        postBody = mp;
      }

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final decoded = response.body is String ? jsonDecode(response.body) : response.body;

        if (
            decoded != null &&
            decoded is Map &&
            decoded["error"] == false &&
            decoded["chat"] != null &&
            decoded["chat"]["message"] != null &&
            decoded["chat"]["message"]["_id"] != null
        ) {
          return decoded["chat"]["message"]["_id"].toString();
        }
      }

      return null;
    }catch(err){
      log('ERROR: postSendMessage - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }
}