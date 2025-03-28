// ignore_for_file: unnecessary_null_comparison

part of benek.api;

class QueryParam {
  String name;
  String value;

  QueryParam(this.name, this.value);
}

class ApiClient {
  String basePath;

  final Map<String, String> _defaultHeaderMap = {};
  final Map<String, Authentication> _authentications = {};

  final _regList = RegExp(r'^List<(.*)>$');
  final _regMap = RegExp(r'^Map<String,(.*)>$');

  ApiClient({this.basePath = "/"}) {
    basePath = AppConfig.baseUrl;
  }

  void addDefaultHeader(String key, String value) {
    _defaultHeaderMap[key] = value;
  }

  dynamic _deserialize( dynamic value, String targetType){
    try {
      switch (targetType) {
        case 'String':
          return '$value';
        case 'int':
          return value is int ? value : int.parse('$value');
        case 'bool':
          return value is bool ? value : '$value'.toLowerCase() == 'true';
        case 'double':
          return value is double ? value : double.parse('$value');
        case 'UserInfoModel':
          return UserInfo.fromJson(value['user']);
        case 'UserSearchResult':
          return UserList.fromJson(value);
        case 'PetListModel':
          return PetListModel.fromJson(value);
        case 'StoryModel':
          return StoryModel.fromJson(value);
        case 'List<StoryModel>':
          List<dynamic> jsonList = value['stories'];
          List<StoryModel> list = jsonList.map((item) => StoryModel.fromJson(item)).toList();
          return list;
        case 'PetModel':
          return PetModel.fromJson(value['pet'] ?? value);
        case 'List<PetModel>':
          List<dynamic> jsonList = value['pets'];
          List<PetModel> list = jsonList.map((item) => PetModel.fromJson(item)).toList();
          return list;
        case 'List<UserInfoModel>':
          List<dynamic> jsonList = value['userList'];
          List<UserInfo> list = jsonList.map((item) => UserInfo.fromJson(item)).toList();
          return list;
        case 'ChatStateModel':
          return ChatStateModel.fromJson(value);
        case 'List<LogModel>':
          List<dynamic> jsonList = value['logs'];
          List<LogModel> list = jsonList.map((item) => LogModel.fromJson(item)).toList();
          return list;
        case 'UnreadMessageCount':
          return value['unreadMessageCount'] is int ? value['unreadMessageCount'] : int.parse('${value['unreadMessageCount']}');
        case 'PunishmentCount':
          return value['punishmentCount'] is int ? value['punishmentCount'] : int.parse('${value['punishmentCount']}');
        case 'List<CommentModel>':
          List<dynamic> jsonList = value['comments'];
          List<CommentModel> list = jsonList.map((item) => CommentModel.fromJson(item)).toList();
          return {
            'totalCommentCount': value['totalCommentCount'] != null
                ? int.parse( value['totalCommentCount'].toString() )
                : 0,
            'list': list
          };
        case 'ReplyList':
          int totalReplyCount = value['totalReplyCount'] != null
              ? int.parse( value['totalReplyCount'].toString() )
              : 0;

          int replyCount = value['replyCount'] != null
              ? int.parse( value['replyCount'].toString() )
              : 0;

          List<dynamic> jsonList = value['replies'];
          List<CommentModel> list = jsonList.map((item) => CommentModel.fromJson(item)).toList();
          return {
            'totalReplyCount': totalReplyCount,
            'replyCount': replyCount,
            'list': list
          };
        case 'PrivateInfoModel':
          return PrivateInfoModel.fromJson(value['data']);
        case 'UserProfileImg':
          return UserProfileImg.fromJson(value['data']);
        case 'List<StarData>':
          List<dynamic> jsonList = value['stars'];
          List<StarData> list = jsonList.map((item) => StarData.fromJson(item)).toList();
          return list;
        case 'List<PetImageModel>':
          List<dynamic> jsonList = value['photos'];
          List<PetImageModel> list = jsonList.map((item) => PetImageModel.fromJson(item)).toList();
          return list;
        case 'List<PunishmentModel>':
          List<dynamic> jsonList = value['punishmentRecords'];
          List<PunishmentModel> list = jsonList.map((item) => PunishmentModel.fromJson(item)).toList();
          return list;

        default:
          {
            Match match;
            if( value is List && ( match = _regList.firstMatch( targetType )! ) != null ){
              var newTargetType = match[1];
              return value.map( ( v ) => _deserialize( v, newTargetType! ) ).toList();
            }else if( value is Map && ( match = _regMap.firstMatch( targetType )! ) != null ){
              var newTargetType = match[1];
              return Map.fromIterables(
                value.keys,
                value.values.map( ( v ) => _deserialize( v, newTargetType! ) )
              );
            }
          }
      }
    }catch( e, stack ){
      if(e is TypeError){
        log(e.toString());
      }else{
        throw ApiException.withInner( 500, 'Exception during deserialization.', e as Exception?, stack );
      }
    }
    throw ApiException( code: 500, message: 'Could not find a suitable class for deserialization');
  }

  dynamic deserialize( String jsonVal, String targetType ){
    targetType = targetType.replaceAll(' ', '');

    if (targetType == 'String') return jsonVal;

    var decodedJson = json.decode(jsonVal);
    return _deserialize(decodedJson, targetType);
  }

  String serialize( Object? obj ){

    String serialized = '';
    if( obj == null ){
      serialized = '';
    } else {
      serialized = json.encode( obj );
    }

    return serialized;
  }

  Future<Response> invokeAPI(
      String path,
      String method,
      List<QueryParam> queryParams,
      Object? body,
      Map<String, String> headerParams,
      Map<String, String> formParams,
      String contentType,
      List<String> authNames
  ) async {
    Store<AppState> store = AppReduxStore.currentStore!;
    
    _updateParams( authNames, queryParams, headerParams );

    var ps = queryParams.where(( p ) => p.value != null ).map( ( p ) => '${p.name}=${p.value}');
    
    String queryString = ps.isNotEmpty ? '?${ps.join('&')}' : '';

    String url = basePath + path + queryString;

    await AuthUtils.getAccessToken();
    final accessToken = store.state.userAccessToken;

    headerParams.addAll(_defaultHeaderMap);
    headerParams['Content-Type'] = contentType;
    headerParams['x-access-token'] = accessToken;

    if( body is MultipartRequest ){
      var request = MultipartRequest(method, Uri.parse(url));
      request.fields.addAll(body.fields);
      request.files.addAll(body.files);
      request.headers.addAll(body.headers);
      request.headers.addAll(headerParams);
      var response = await request.send();
      return Response.fromStream(response);
    }else{
      var msgBody = contentType == "application/x-www-form-urlencoded"
          ? formParams
          : serialize(body);

      // final stopwatch = Stopwatch()..start();
      Future<Response>? response;

      try {
        switch (method) {
          case "POST":
            response = post(Uri.parse(url), headers: headerParams, body: msgBody);
            break;
          case "PUT":
            response = put(Uri.parse(url), headers: headerParams, body: msgBody);
            break;
          case "DELETE":
            response = delete(Uri.parse(url), headers: headerParams, body: msgBody);
            break;
          case "PATCH":
            response = patch(Uri.parse(url), headers: headerParams, body: msgBody);
            break;
          default:
            response = get(Uri.parse(url), headers: headerParams);
            break;
        }

        response.then(
          ( resp ){

            if(
              resp.statusCode == 401
              || resp.statusCode == 400
              || resp.statusCode >= 500
            ){
              log('API Error: ${resp.statusCode} ${resp.body}');
            }
            //   AuthUtils.killUserSessionAndRestartApp( store ).then(
            //     ( value ) => log("User Session Killed!!")
            //   );
            // }
          }
        ).catchError(
          ( exception ){
            var errorMessage = getApiExceptionMessage(path, method, exception);
            log(errorMessage);
            // AuthUtils.killUserSessionAndRestartApp( store );
          }
        );
      } catch (exception) {
        log(getApiExceptionMessage(path, method, exception));
        // AuthUtils.killUserSessionAndRestartApp( store );
      }

      return await response ?? Response('', 500);
    }
  }

  String getApiExceptionMessage(
    String path, 
    String method, 
    dynamic exception
  ){
    String errorMessage = 'api call error path: $path method: $method message: $exception';
    return errorMessage;
  }

  void logRequestTime(String url, Stopwatch stopwatch) {
    log('Request Time Log: $url > ${stopwatch.elapsedMilliseconds}');
  }

  /// Update query and header parameters based on authentication settings.
  /// @param authNames The authentications to apply
  void _updateParams(
    List<String> authNames,
    List<QueryParam> queryParams, 
    Map<String, String> headerParams
  ){
    for( var authName in authNames ){
      Authentication? auth = _authentications[authName];
      if (auth == null) {
        throw ArgumentError("Authentication undefined: $authName");
      }
      auth.applyToParams(queryParams, headerParams);
    }
  }
}