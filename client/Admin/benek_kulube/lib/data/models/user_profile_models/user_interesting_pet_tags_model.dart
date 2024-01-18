class UserInterestingPetTags {
  String? petId;
  String? speciesId;

  UserInterestingPetTags(
    {
      this.petId, 
      this.speciesId
    }
  );

  UserInterestingPetTags.fromJson( Map<String, dynamic> json ){
    petId = json['petId'];
    speciesId = json['speciesId'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['petId'] = petId;
    data['speciesId'] = speciesId;
    return data;
  }
}