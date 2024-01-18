class UserPastCaregivers {
  String? pet;
  String? careGiver;
  String? startDate;
  String? endDate;
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
    startDate = json['startDate'];
    endDate = json['endDate'];
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
}