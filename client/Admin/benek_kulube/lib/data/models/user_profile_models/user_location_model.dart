class UserLocation {
  String? country;
  String? city;
  double? lat;
  double? lng;

  UserLocation(
    {
      this.country, 
      this.city, 
      this.lat, 
      this.lng
    }
  );

  UserLocation.fromJson( Map<String, dynamic> json ){
    country = json['country'];
    city = json['city'];
    lat = json['lat'];
    lng = json['lng'] ?? json['long'];
  }

  Map<String, dynamic> toJson(){
    final Map<String, dynamic> data = <String, dynamic>{};
    data['country'] = country;
    data['city'] = city;
    data['lat'] = lat;
    data['lng'] = lng;
    return data;
  }
}