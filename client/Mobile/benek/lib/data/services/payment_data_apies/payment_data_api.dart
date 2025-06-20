part of benek.api;

class PaymentDataApi {
  final ApiClient apiClient;

  PaymentDataApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  Future<List<PaymentDataModel>?> getPaymentDataListByDateRequest() async {
    try{
      await AuthUtils.getAccessToken();
      DateTime thisMonth = DateTime(DateTime.now().year, DateTime.now().month, 1);
      String formattedDate = DateFormat('yyyy-MM-dd').format(thisMonth);

      String path = '/api/admin/getPaymentsFromDate/$formattedDate';
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
        return null;
      } else if (response.body != null) {
        return await apiClient.deserialize(response.body, 'List<PaymentDataModel>') as List<PaymentDataModel>;
      } else {
        log('ERROR: getPaymentDataListByDateRequest - response is null');
        // await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getPaymentDataListByDateRequest - $err');
      // await AuthUtils.killUserSessionAndRestartApp( store );
    }
    return null;
  }

  Future<Map<String, dynamic>?> getPaymentCountOnPoolRequest() async {
    try {
      await AuthUtils.getAccessToken();
      String path = '/api/admin/getPaymentsOnPool';
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
        return null;
      } else if (response.body != null) {
        var decodedResponse = json.decode(response.body);
        Map<String, dynamic> paymentCount = {
          'totalMoneyOnPool': decodedResponse['totalMoneyOnPool']?.toDouble(),
          'profit': decodedResponse['profit']?.toDouble(),
          'customersShare': decodedResponse['customersShare']?.toDouble(),
          'customersTax': decodedResponse['customersTax']?.toDouble(),
        };

        return paymentCount;
      } else {
        log('ERROR: getPaymentCountOnPoolRequest - response is null');
      }
    } catch (err) {
      log('ERROR: getPaymentCountOnPoolRequest - $err');
    }
    return null;
  }
}