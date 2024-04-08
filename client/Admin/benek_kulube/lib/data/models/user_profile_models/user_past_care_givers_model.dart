import 'package:benek_kulube/data/models/pet_models/pet_model.dart';
import 'package:benek_kulube/data/models/user_profile_models/user_info_model.dart';
import 'package:intl/intl.dart';

class UserPastCaregivers {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  dynamic pet;
  dynamic careGiver;
  DateTime? startDate;
  DateTime? endDate;
  String? price;

  UserPastCaregivers(
    {
      this.pet, 
      this.careGiver, 
      this.startDate, 
      this.endDate, 
      this.price
    }
  );

  UserPastCaregivers.fromJson( Map<String, dynamic> json ){
    pet = json['pet'];
    careGiver = json['careGiver'];
    startDate = format.parse(json['startDate']);
    endDate = format.parse(json['endDate']);
    price = json['price'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['pet'] = pet;
    data['careGiver'] = careGiver;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    if( price != null ){
      data['price'] = price;
    }
    return data;
  }

  dynamic initCareGiver( UserInfo careGiverAsUserInfo ){
    careGiver = careGiverAsUserInfo;
  }

  dynamic initPet( PetModel petAsPetModel ){
    pet = petAsPetModel;
  }
}