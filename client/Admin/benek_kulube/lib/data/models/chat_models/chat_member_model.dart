import 'package:intl/intl.dart';

import '../user_profile_models/user_info_model.dart';

class ChatMemberModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  UserInfo? userData;
  DateTime? joinDate;

  ChatMemberModel(
      {
        this.userData,
        this.joinDate,
      }
      );

  ChatMemberModel.fromJson(Map<String, dynamic> json) {
    userData = UserInfo.fromJson(json);
    joinDate = format.parse(json['joinDate']);
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['userData'] = userData;
    data['joinDate'] = joinDate;
    return data;
  }

  ChatMemberModel.fromUserInfo(UserInfo userInfo) {
    userData = userInfo;
    joinDate = DateTime.now();
  }
}