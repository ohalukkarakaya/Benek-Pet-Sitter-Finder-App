import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:intl/intl.dart';

class StarData {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  UserInfo? owner;
  PetModel? pet;
  int? star;
  DateTime? date;

  StarData({
    this.owner,
    this.pet,
    this.star,
    this.date
  });

  StarData.fromJson(Map<String, dynamic> json){
    owner = UserInfo.fromJson(json['owner']);
    pet = json['pet'] != null ? PetModel.fromJson(json['pet']) : null;
    star = json['star'];
    date = format.parse(json['date']);
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['owner'] = owner;
    data['pet'] = pet;
    data['star'] = star;
    data['date'] = date;
    return data;
  }
}