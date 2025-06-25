part of '../api.dart';

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
        await store.dispatch(const ChangeScreenAction( AppScreenEnums.ERROR_SCREEN ));
      }
    }catch( err ){
      log('ERROR: getUserInfoRequest - $err');
      await store.dispatch(const ChangeScreenAction( AppScreenEnums.ERROR_SCREEN ));
    }
  }

  Future<UserProfileImg?> putUpdateProfileImage(String? filePath) async {
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

  Future<Map<String, dynamic>?> putBecomeCareGiver() async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/becomeCareGiver';

      Object? postBody;
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: putBecomeCareGiver - ${json.decode(response.body)["message"]}');
        return {'error': true, 'message': json.decode(response.body)["message"] };
      }else if( response.body != null ){
        var data = json.decode(response.body);;
        bool isCareGiver = !(data['error']);
        return { 'error': false, 'isCareGiver': isCareGiver };
      }
    }
    catch( err ){
      log('ERROR: putBecomeCareGiver - $err');
    }
    return null;
  }

  Future<Map<String, dynamic>?> putUpdateFullname(String fullname) async {
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/fullname';

      List<String> names = fullname.split(' ');
      if( names.length < 2 ){
        return null;
      }

      Object? postBody = {
        'fullname': fullname,
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

        String firstName = decodedJson['data']['firstName'];
        String? middleName = decodedJson['data']['middleName'];
        String lastName = decodedJson['data']['lastName'];

        Map<String, dynamic> data = {
          'firstName': firstName,
          'middleName': middleName,
          'lastName': lastName,
        };

        return data;
      }
    } catch (err) {
      log('ERROR: putUpdateFullname - $err');
    }
    return null;
  }

  Future<bool?> putUpdateUserName(String newUserName) async {
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/resetUsername';

      Object? postBody = {
        'newUserName': newUserName,
      };

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        return false;
      } else if (response.body != null) {
        return true;
      }
    } catch (err) {
      log('ERROR: putUpdateUserName - $err');
    }
    return false;
  }

  Future<bool?> postResetEmail(String newEmail) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/resetEmail';

      Object? postBody = {
        'newEmail': newEmail,
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: postResetEmail - ${json.decode(response.body)["message"]}');
        return false;
      }else if( response.body != null ){
        return true;
      }
      return false;
    }catch( err ){
      log('ERROR: postResetEmail - $err');
      return false;
    }
  }

  Future<bool?> postResendEmailOtp(String email) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/auth/resendOtp';

      Object? postBody = {
        'email': email,
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: postResendEmailOtp - ${json.decode(response.body)["message"]}');
        return false;
      }else if( response.body != null ){
        return true;
      }
      return false;
    }catch( err ){
      log('ERROR: postResendEmailOtp - $err');
      return false;
    }
  }

  Future<bool?> postVerifyEmailOtp(String otp, String email) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/verifyResetEmailOTP';

      Object? postBody = {
        'otp': otp,
        'email': email,
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: postVerifyEmailOtp - ${json.decode(response.body)["message"]}');
        return false;
      }else if( response.body != null ){
        return true;
      }
      return false;
    }catch( err ){
      log('ERROR: postVerifyEmailOtp - $err');
      return false;
    }
  }

  Future<bool?> postVerifyEmailOtpTrustedId(String otp, String email, String clientId) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/auth/verifyOTP';

      Object? postBody = {
        'otp': otp,
        'email': email,
        'ip': clientId
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: postVerifyEmailOtpTrustedId - ${json.decode(response.body)["message"]}');
        return false;
      }else if( response.body != null ){
        return true;
      }
      return false;
    }catch( err ){
      log('ERROR: postVerifyEmailOtpTrustedId - $err');
      return false;
    }
  }

  Future<bool?> postResetPhoneNumber(String newPhone) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/addPhoneNumber';

      Object? postBody = {
        'phoneNumber': "+9$newPhone",
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: postResetPhoneApi - ${json.decode(response.body)["message"]}');
        return false;
      }else if( response.body != null ){
        return true;
      }
      return false;
    }catch( err ){
      log('ERROR: postResetPhoneApi - $err');
      return false;
    }
  }

  Future<bool?> postVerifyPhoneOtp(String otp, String phone) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/verifyPhoneNumber';

      Object? postBody = {
        'otp': otp,
        'phoneNumber': "+9$phone",
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'POST', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        log('ERROR: postVerifyPhoneOtpApi - ${json.decode(response.body)["message"]}');
        return false;
      }else if( response.body != null ){
        return true;
      }
      return false;
    }catch( err ){
      log('ERROR: postVerifyPhoneOtpApi - $err');
      return false;
    }
  }

  Future<bool?> putUpdateTCIdNo(String tcNo) async {
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/addIdNo';

      Object? postBody = {
        'isTCCitizen': "true", //for now, only Turkish citizens can update their TC ID
        'countryCode': 'TR',
        'idNo': tcNo,
      };

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        return false;
      } else if (response.body != null) {
        return true;
      }
    } catch (err) {
      log('ERROR: updateTCIdNo - $err');
    }
    return false;
  }

  Future<bool?> putUpdateCareGiverPaymentInfo(String fullname, String iban) async {
    try {
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/careGiverPaymentInfo';

      Object? postBody = {
        'name': fullname,
        'iban': iban,
      };

      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if (response.statusCode >= 400 && response.statusCode != 404) {
        return false;
      } else if (response.body != null) {
        return true;
      }
    } catch (err) {
      log('ERROR: updateTCIdNo - $err');
    }
    return false;
  }

  Future<bool?> putUpdatePassword( String newPassword, String oldPassword, String oldPasswordReply ) async {
    try{
      await AuthUtils.getAccessToken();

      const String path = '/api/user/profileSettings/resetPassword';

      Object? postBody = {
        'oldPassword': oldPassword,
        'oldPasswordReply': oldPasswordReply,
        'newPassword': newPassword
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> authNames = [];

      String contentType = "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        return false;
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: putUpdatePassword - $err');
    }
    return false;
  }

  Future<bool?> putForgetPassword( String email ) async {
    try{
      const String path = '/api/user/profileSettings/forgetMyPassword';

      Object? postBody = {
        'email': email,
      };
      List<QueryParam> queryParams = [];
      Map<String, String> headerParams = {};
      Map<String, String> formParams = {};
      List<String> contentTypes = ["application/json"];
      List<String> authNames = [];

      String contentType = contentTypes.isNotEmpty ? contentTypes[0] : "application/json";

      var response = await apiClient.invokeAPI(path, 'PUT', queryParams, postBody, headerParams, formParams, contentType, authNames);
      if( response.statusCode >= 400 && response.statusCode != 404 ){
        return false;
      }else if( response.body != null ){
        return true;
      }
    }catch( err ){
      log('ERROR: putForgetPassword - $err');
    }
    return false;
  }
}