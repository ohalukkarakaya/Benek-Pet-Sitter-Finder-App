import 'package:intl/intl.dart';

import '../pet_models/pet_model.dart';

class UserCaregiverCareer {
  DateFormat format = DateFormat('yyyy-MM-ddTHH:mm:ss.SSSZ');

  dynamic pet;
  DateTime? startDate;
  DateTime? endDate;
  String? price;

  UserCaregiverCareer(
    {
      this.pet, 
      this.startDate, 
      this.endDate, 
      this.price
    }
  );

  UserCaregiverCareer.fromJson( Map<String, dynamic> json ){
    pet = json['pet'];
    startDate = format.parse(json['startDate']);
    endDate = format.parse(json['endDate']);
    price = json['price'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['pet'] = pet;
    data['startDate'] = startDate;
    data['endDate'] = endDate;
    data['price'] = price;
    return data;
  }

  dynamic initPet( PetModel petAsPetModel ){
    pet = petAsPetModel;
  }
}