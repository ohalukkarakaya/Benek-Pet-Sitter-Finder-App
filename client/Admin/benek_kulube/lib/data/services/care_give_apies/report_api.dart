part of benek.api;

class ReportApi {
  final ApiClient apiClient;

  ReportApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<ReportStateModel?> getReportedMissionListRequest() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try {
      await AuthUtils.getAccessToken();
      int limit = 15;
      String lastItemId = store.state.reports != null
          && store.state.reports!.reports != null
          && store.state.reports!.reports!.isNotEmpty
            ? store.state.reports!.reports![store.state.reports!.reports!.length - 1].reportId.toString()
            : 'null';
      String path = '/api/admin/reportedMissionList/$lastItemId/$limit';
      Object? postBody;

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
      } else if (response.statusCode == 404) {
        return await apiClient.deserialize('{"reportedMissionCount": 0, "reportedMissionList": []}', 'ReportStateModel') as ReportStateModel;
      } else if (response.body != null) {
        return await apiClient.deserialize(response.body, 'ReportStateModel') as ReportStateModel;
      } else {
        log('ERROR: getReportedMissionListRequest - response is null');
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    } catch (err) {
      log('ERROR: getReportedMissionListRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }

    return null;
  }

  Future<bool> postGiveResponseToReportRequest( String reportId, bool adminResponse, String? responseDesc ) async {
    try{
      await AuthUtils.getAccessToken();

      String path = '/api/admin/replyReport/$reportId/${adminResponse.toString()}';

      Object? postBody = responseDesc != null ? { 'responseDesc': responseDesc } : null;

      // Query Params
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = [];
      List<String> authNames = [];

      String contentType = "application/json";
      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (response.body != null) {
        return true;
      } else {
        log('ERROR: postGiveResponseToReport - response body is null');
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: postGiveResponseToReport - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
    return false;
  }
}