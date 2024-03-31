import '../pet_models/pet_model.dart';

class StoryAboutDataModel{
  String? aboutType;
  PetModel? pet;

  StoryAboutDataModel({this.aboutType, this.pet});

  StoryAboutDataModel.fromJson(Map<String, dynamic> json) {
    aboutType = json['aboutType'];
    pet = json['taged'] != null ? PetModel.fromJson(json['taged']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['aboutType'] = aboutType;
    if (pet != null) {
      data['taged'] = pet!.toJson();
    }
    return data;
  }
}