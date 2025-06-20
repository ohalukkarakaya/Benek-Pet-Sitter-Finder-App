import 'package:benek/data/models/care_give_models/user_contact_data_model.dart';
import 'package:benek/data/models/pet_models/pet_model.dart';
import 'package:intl/intl.dart';

import '../user_profile_models/user_info_model.dart';
import '../user_profile_models/user_location_model.dart';

class CareGive {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  String? id;
  UserContactDataModel? careGiverContact;
  UserContactDataModel? petOwnerContact;
  UserInfo? careGiver;
  UserInfo? petOwner;
  PetModel? pet;
  DateTime? startDate;
  DateTime? endDate;
  String? adressDesc;
  UserLocation? location;
  bool? isStarted;
  bool? isFinished;
  String? price;
  int? missionCount;

  CareGive(
      {
        this.id,
        this.careGiverContact,
        this.petOwnerContact,
        this.careGiver,
        this.petOwner,
        this.pet,
        this.startDate,
        this.endDate,
        this.adressDesc,
        this.location,
        this.isStarted,
        this.isFinished,
        this.price,
        this.missionCount
      }
  );

  CareGive.fromJson(Map<String, dynamic> json) {
    id = json['_id'] ?? json['id'];
    careGiverContact = json['careGiverContact'] != null ? UserContactDataModel.fromJson(json['careGiverContact']) : null;
    petOwnerContact = json['petOwnerContact'] != null ? UserContactDataModel.fromJson(json['petOwnerContact']) : null;
    careGiver = json['careGiver'] != null ? UserInfo.fromJson(json['careGiver']) : null;
    petOwner = json['petOwner'] != null ? UserInfo.fromJson(json['petOwner']) : null;
    pet = json['pet'] != null ? PetModel.fromJson(json['pet']) : null;
    startDate = format.parse(json['startDate']);
    endDate = format.parse(json['endDate']);
    adressDesc = json['adress']['adressDesc'];
    location = UserLocation.fromJson(json['adress']);
    isStarted = json['isStarted'] ?? false;
    isFinished = json['isFinished'] ?? false;
    price = json['price'];
    missionCount = json['missionCount'] ?? 0;
  }
}