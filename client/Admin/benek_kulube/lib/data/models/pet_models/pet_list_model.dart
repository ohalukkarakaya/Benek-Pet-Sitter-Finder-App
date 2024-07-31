import 'package:benek_kulube/data/models/pet_models/pet_model.dart';

class PetListModel {
  int? totalDataCount;
  List<PetModel>? pets;

  PetListModel({
    this.totalDataCount = 0,
    this.pets
  });

   PetListModel.fromJson(Map<String, dynamic> json) {
     totalDataCount = json['totalDataCount'] ?? 0;
     if (json['pets'] != null) {
       pets = <PetModel>[];
       json['pets'].forEach((v) {
         pets!.add(PetModel.fromJson(v));
       });
     }
   }
}