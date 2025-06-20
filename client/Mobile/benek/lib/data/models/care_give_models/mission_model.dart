import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:benek/data/models/user_profile_models/user_info_model.dart';
import 'package:intl/intl.dart';

import 'mission_content_model.dart';

class MissionModel {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  int? roleId;
  PetModel? pet;
  UserInfo? petOwner;
  UserInfo? careGiver;
  String? desc;
  DateTime? date;
  DateTime? deadLine;
  bool? isExtra;
  MissionContentModel? content;

  MissionModel(
      {
        this.id,
        this.roleId,
        this.pet,
        this.petOwner,
        this.careGiver,
        this.desc,
        this.date,
        this.deadLine,
        this.isExtra,
        this.content
      }
  );

  MissionModel.fromJson(Map<String, dynamic> json) {
    id = json['_id'] ?? json['id'];
    roleId = json['roleId'];
    pet = json['pet'] != null ? PetModel.fromJson(json['pet']) : null;
    petOwner = json['petOwner'] != null ? UserInfo.fromJson(json['petOwner']) : null;
    careGiver = json['careGiver'] != null ? UserInfo.fromJson(json['careGiver']) : null;
    desc = json['desc'];
    date = json['date'] != null ? format.parse(json['date']) : null;
    deadLine = json['deadline'] != null ? format.parse(json['deadline']) : null;
    isExtra = json['isExtra'] ?? false;
    content = json['content'] != null ? MissionContentModel.fromJson(json['content']) : null;
  }
}