class UserCaregiverCareer {
  String? pet;
  String? startDate;
  String? endDate;
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
    startDate = json['startDate'];
    endDate = json['endDate'];
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
}