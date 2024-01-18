class UserStars {
  String? ownerId;
  String? petId;
  int? star;
  String? date;

  UserStars(
    {
      this.ownerId, 
      this.petId, 
      this.star, 
      this.date
    }
  );

  UserStars.fromJson( Map<String, dynamic> json ){
    ownerId = json['ownerId'];
    petId = json['petId'];
    star = json['star'];
    date = json['date'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['ownerId'] = ownerId;
    data['petId'] = petId;
    data['star'] = star;
    data['date'] = date;
    return data;
  }
}