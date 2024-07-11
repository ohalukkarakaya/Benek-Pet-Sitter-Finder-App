import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:intl/intl.dart';

class PunishmentModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  String? adminDesc;
  DateTime? date;
  UserInfo? admin;

  PunishmentModel({
    required this.id,
    required this.adminDesc,
    required this.date,
    required this.admin
  });

  PunishmentModel.fromJson( Map<String, dynamic> json ){
    id = json['_id'];
    adminDesc = json['adminDesc'];
    date = format.parse(json['createdAt']);
    admin = UserInfo.fromJson(json['admin']);
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = id;
    data['adminDesc'] = adminDesc;
    data['createdAt'] = date;
    data['admin'] = admin!.toJson();
    return data;
  }
}