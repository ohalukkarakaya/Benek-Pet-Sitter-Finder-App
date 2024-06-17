import 'package:benek_kulube/data/models/pet_models/pet_care_giver_history_model.dart';
import 'package:benek_kulube/data/models/pet_models/pet_handover_record_model.dart';
import 'package:benek_kulube/data/models/pet_models/pet_image_model.dart';
import 'package:benek_kulube/data/models/pet_models/pet_vaccination_certificate_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';

import '../../../presentation/features/date_helpers/date_time_helpers.dart';
import '../user_profile_models/user_profile_image_model.dart';

class PetModel {
  String? id;
  String? name;
  UserProfileImg? petProfileImg;
  String? bio;
  String? sex;
  DateTime? birthDay;
  String? kind;
  String? species;
  List<PetVaccinationCertificateModel>? vaccinations;
  List<PetCareGiverHistoryModel>? careGiverHistory;
  UserInfo? primaryOwner;
  List<String>? followers;
  List<PetImageModel>? images;
  List<PetHandoverRecordModel>? handOverRecord;
  DateTime? createdAt;
  DateTime? updatedAt;
  List<UserInfo>? allOwnerInfoList;

  PetModel(
      {
        this.id,
        this.name,
        this.petProfileImg,
        this.bio,
        this.sex,
        this.birthDay,
        this.kind,
        this.species,
        this.vaccinations,
        this.careGiverHistory,
        this.primaryOwner,
        this.followers,
        this.images,
        this.handOverRecord,
        this.createdAt,
        this.updatedAt,
        this.allOwnerInfoList});

  PetModel.fromJson(Map<String, dynamic> json) {
    id = json['id'] ?? (json['_id'] ?? json['petId']);
    name = json['name'] ?? json['petName'];
    petProfileImg = json['petProfileImg'] != null
        || json['petProfileImgUrl'] != null
        ? UserProfileImg(
          imgUrl: json['petProfileImg'] is Map<String, dynamic>
              ? json['petProfileImg']['imgUrl']
              : json['petProfileImgUrl']
              ?? json['petProfileImg'],
          isDefaultImg: json['petProfileImg'] is Map<String, dynamic> ? json['petProfileImg']['isDefaultImg'] : json['isDefaultImg'] ?? json['isDefault'],
        )
        : null;
    bio = json['bio'];
    sex = json['sex'];
    birthDay = DateTimeHelpers.getDateTime(json['birthDay']);
    kind = json['kind'];
    species = json['species'];
    if (json['vaccinations'] != null) {
      vaccinations = <PetVaccinationCertificateModel>[];
      json['vaccinations'].forEach((v) {
        vaccinations!.add(PetVaccinationCertificateModel.fromJson(v));
      });
    }
    if (json['careGiverHistory'] != null) {
      careGiverHistory = <PetCareGiverHistoryModel>[];
      json['careGiverHistory'].forEach((v) {
        careGiverHistory!.add(PetCareGiverHistoryModel.fromJson(v));
      });
    }
    primaryOwner = json['primaryOwner'] != null
        ? UserInfo.fromJson(json['primaryOwner'])
        : null;
    followers = json['followers'] != null ? json['followers'].cast<String>() : [];
    if (json['images'] != null) {
      images = <PetImageModel>[];
      json['images'].forEach((v) {
        images!.add(PetImageModel.fromJson(v));
      });
    }
    if (json['handOverRecord'] != null) {
      handOverRecord = <PetHandoverRecordModel>[];
      json['handOverRecord'].forEach((v) {
        handOverRecord!.add(PetHandoverRecordModel.fromJson(v));
      });
    }
    createdAt = json['createdAt'] != null ? DateTimeHelpers.getDateTime(json['createdAt']) : null;
    updatedAt = json['updatedAt'] != null ? DateTimeHelpers.getDateTime(json['updatedAt']) : null;
    if (json['allOwnerInfoList'] != null) {
      allOwnerInfoList = <UserInfo>[];
      json['allOwnerInfoList'].forEach((v) {
        allOwnerInfoList!.add(UserInfo.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = id;
    data['name'] = name;
    if (petProfileImg != null) {
      data['petProfileImg'] = petProfileImg!.toJson();
    }
    data['bio'] = bio;
    data['sex'] = sex;
    data['birthDay'] = birthDay;
    data['kind'] = kind;
    data['species'] = species;
    if (vaccinations != null) {
      data['vaccinations'] = vaccinations!.map((v) => v.toJson()).toList();
    }
    if (careGiverHistory != null) {
      data['careGiverHistory'] =
          careGiverHistory!.map((v) => v.toJson()).toList();
    }
    if (primaryOwner != null) {
      data['primaryOwner'] = primaryOwner!.toJson();
    }
    data['followers'] = followers ?? [];
    if (images != null) {
      data['images'] = images!.map((v) => v.toJson()).toList();
    }
    if (handOverRecord != null) {
      data['handOverRecord'] =
          handOverRecord!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = createdAt.toString();
    data['updatedAt'] = updatedAt.toString();
    if (allOwnerInfoList != null) {
      data['allOwnerInfoList'] =
          allOwnerInfoList!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}