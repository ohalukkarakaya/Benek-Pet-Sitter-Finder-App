part of benek.api;

class UserInfoApi {

  final ApiClient apiClient;
  
  UserInfoApi([ApiClient? apiClient]) : apiClient = apiClient ?? defaultApiClient;

  // Get Logged In User Info
  Future<dynamic> getUserInfoRequest() async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/getLoggedInUserInfo';

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
      if (response.statusCode >= 400) {
        throw ApiException(code: response.statusCode, message: response.body);
      // ignore: unnecessary_null_comparison
      }else if( response.body != null ){
        return apiClient.deserialize( response.body, 'UserInfoModel' ) as UserInfo;
      }else{
        await AuthUtils.killUserSessionAndRestartApp( store );
      }
    }catch( err ){
      log('ERROR: getUserInfoRequest - $err');
      await AuthUtils.killUserSessionAndRestartApp( store );
    }
  }

  Future<UserProfileImg?> putUpdateProfileImage(String? filePath) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileImage';

      Object? postBody;
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["multipart/form-data"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      if (contentType.startsWith("multipart/form-data") && filePath != null) {
        MultipartRequest mp = MultipartRequest("PUT", Uri.parse(AppConfig.baseUrl + path));

        String mimeType = 'application/octet-stream';
        if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.JPG') || filePath.endsWith('.JPEG')) {
          mimeType = 'image/jpeg';
        }

        mp.files.add(await http.MultipartFile.fromPath(
          'profileImg',
          filePath,
          contentType: MediaType.parse(mimeType),
        ));

        postBody = mp;
      }

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (response.body != null) {
        return apiClient.deserialize(response.body, 'UserProfileImg') as UserProfileImg;
      }
    } catch (err) {
      log('ERROR: putUpdateProfileImage - $err');
    }
    return null;
  }

  Future<String?> putUpdateBio(String newBio) async {
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/bio';

      newBio = newBio.length > 150
          ? "${newBio.substring(0, 147)}..."
          : newBio;

      Object? postBody = {
        'bio': newBio,
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (response.body != null) {
        var decodedJson = json.decode(response.body);
        return decodedJson['data'];
      }
    } catch (err) {
      log('ERROR: putUpdateProfileImage - $err');
    }
    return null;
  }

  Future<Map<String, dynamic>?> putUpdateAddress(String country, String city, String openAdress, double lat, double lng) async {
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/adress';

      Object? postBody = {
        'country': country,
        'city': city,
        'openAdress': openAdress,
        'lat': lat,
        'lng': lng,
      };

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        throw ApiException(code: response.statusCode, message: response.body);
      } else if (response.body != null) {
        var decodedJson = json.decode(response.body);
        var data = decodedJson['data'];
        UserLocation userLocation = UserLocation(
          country: data['country'],
          city: data['city'],
          lat: data['lat'],
          lng: data['lng'],
        );

        String openAdress = data['openAdress'];

        return {
          'userLocation': userLocation,
          'openAdress': openAdress,
        };
      }
    } catch (err) {
      log('ERROR: putUpdateProfileImage - $err');
    }
    return null;
  }
}