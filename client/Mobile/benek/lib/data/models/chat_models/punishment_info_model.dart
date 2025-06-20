import 'package:benek/data/models/chat_models/punishment_model.dart';

class PunishmentInfoModel {
  int? punishmentCount;
  List<PunishmentModel>? punishmentList;

  PunishmentInfoModel({
    this.punishmentCount,
    this.punishmentList
  });

  void setPunishmentCount(int count){
    punishmentCount = count;
  }

  void setPunishmentList(List<PunishmentModel> list){
    punishmentList = list;
  }

  void setPunishmentListFromJson(Map<String, dynamic> json){
    punishmentList = <PunishmentModel>[];
    json['punishmentRecords'].forEach((v) {
      punishmentList!.add(PunishmentModel.fromJson(v));
    });
  }
}