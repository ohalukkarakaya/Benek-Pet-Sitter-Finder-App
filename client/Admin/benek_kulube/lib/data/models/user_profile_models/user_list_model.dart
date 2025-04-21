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
      totalDataInServer = json['totalDataCount'] ?? json['totalEmployeecount'];
      if( json['dataList'] != null ){
        users = <UserInfo>[];
        json['dataList'].forEach(
          ( v ){
            users!.add( UserInfo.fromJson( v ) );
          }
        );
      }else if( json['employeeData'] != null ){
        users = <UserInfo>[];
        json['employeeData'].forEach(
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

  dynamic addNewSeenUser( UserInfo? user ){
    if( user == null ){
      return;
    }

    UserInfo existingUser = recentlySeenUsers?.firstWhere(
      (userElement) => userElement.userId == user.userId,
      orElse: () => UserInfo()
    ) ?? UserInfo();

    if( existingUser.userId != null ){
      recentlySeenUsers!.remove( existingUser );
    }
    
    if( recentlySeenUsers != null && recentlySeenUsers!.length > 6 ){
      recentlySeenUsers!.removeAt(0);
    }

    recentlySeenUsers ??= <UserInfo>[];

    recentlySeenUsers?.add( user );
  }

  dynamic removeUser( String? userId ){
    if( userId == null ){
      return;
    }

    UserInfo existingUserSeenUsers = recentlySeenUsers?.firstWhere(
      (userElement) => userElement.userId == userId,
      orElse: () => UserInfo()
    ) ?? UserInfo();

    if( existingUserSeenUsers.userId != null ){
      recentlySeenUsers!.remove( existingUserSeenUsers );
    }

    UserInfo existingUser = users?.firstWhere(
      (userElement) => userElement.userId == userId,
      orElse: () => UserInfo()
    ) ?? UserInfo();

    if( existingUser.userId != null ){
      users!.remove( existingUser );
    }
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