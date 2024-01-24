import 'dart:developer';

import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

class UserList {
  int? totalDataInServer;
  String? searchValue;
  List<UserInfo>? recentlySeenUsers;
  List<UserInfo>? users;

  UserList(
    {
      this.totalDataInServer,
      this.searchValue,
      this.recentlySeenUsers = const <UserInfo>[],
      this.users
    }
  );

  UserList.fromJson( Map<String, dynamic> json ){
    try{
      totalDataInServer = json['totalDataCount'];
      if( json['dataList'] != null ){
        users = <UserInfo>[];
        json['dataList'].forEach(
          ( v ){
            users!.add( UserInfo.fromJson( v ) );
          }
        );
      }
    }catch(err){
      log('ERROR: UserList.fromJson - $err');
    }
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['totalDataCount'] = totalDataInServer;
    data['recentlySeenUsers'] = recentlySeenUsers!.map(
        ( v ) => 
              v.toJson()
    ).toList();
    data['dataList'] = users!.map(
        ( v ) => 
              v.toJson()
    ).toList();

    return data;
  }

  dynamic addNewSeenUser( UserInfo user ){
    if( recentlySeenUsers != null && recentlySeenUsers!.contains( user ) ){
      recentlySeenUsers!.remove( user );
    }
    
    if( recentlySeenUsers != null && recentlySeenUsers!.length >= 5 ){
      recentlySeenUsers!.removeAt(0);
    }

    recentlySeenUsers?.add( user );
  }

  dynamic addNewPage( UserList result ){
    users?.addAll( result.users! );

    removeDuplicateUsers();
  }

  dynamic setSearchValue( String value ){
    searchValue = value;
  }

  void removeDuplicateUsers() {
    if (users != null) {
      Map<String, UserInfo> userMap = {};

      for (UserInfo user in users!) {
        if (user.userId != null) {
          userMap[user.userId!] = user;
        }
      }
      users!.clear();
      users!.addAll(userMap.values);
    }
  }
}